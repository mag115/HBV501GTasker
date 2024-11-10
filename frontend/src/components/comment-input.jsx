// comment-input.jsx
import React, { useState } from 'react';
import { request } from '../api/http';
import { useAuth } from '../context/auth-context';

const CommentInput = ({ taskId }) => {
  const { auth } = useAuth();
  const [comment, setComment] = useState('');

  const handleCommentSubmit = async () => {
    try {
      const response = await request(
        'post',
        `/notifications/${taskId}/${auth.userId}/comment`,
        { comment: comment }
      );

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
