// comment-input.jsx
import React, { useState } from 'react';
import { request } from '../api/http';
import { useAuth } from '../context/auth-context';
import { useNotifications } from '../context/notification-context';

const CommentInput = ({ taskId }) => {
  const { auth } = useAuth();
  const [comment, setComment] = useState('');
  const { fetchUnreadNotifications } = useNotifications();

  const handleCommentSubmit = async () => {
    try {
      const response = await request(
        'post',
        `/notifications/${taskId}/${auth.userId}/comment`,
        { comment: comment }
      );
      if (auth?.userId && auth?.token) {
                  fetchUnreadNotifications(auth.userId, auth.token);
                } else {
                  console.warn('Cannot fetch notifications - userId or token missing.');
                }

      if (response.status === 200) {
        alert('Comment posted successfully!');
        setComment(''); // Clear the comment field
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment.');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Send a comment..."
        className="p-1 mb-2"
        style={{ border: '1px solid black' }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleCommentSubmit();
          }
        }}
      />
    </div>
  );
};

export { CommentInput };
