import React from 'react';
import axios from 'axios';
import { useAuth } from '../context/auth-context';

const NotificationsList = ({ notifications, onMarkAsRead }) => {
  const { auth } = useAuth();
  // Function to call the backend endpoint
  const sendTaskReminders = async () => {
    try {
      // Make the POST request to the backend
      const response = await axios.post('/notifications/send');
      if (response.status === 200) {
        alert('Task assignment notifications sent to all team members.');
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
      alert('Failed to send notifications.');
    }
  };

  console.log('notifications', notifications);

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      {auth.role === 'PROJECT_MANAGER' && (
        <button
          onClick={sendTaskReminders}
          className="mb-6 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 ease-in-out shadow-lg w-full"
        >
          Send task assignment notifications to team members
        </button>
      )}

      {notifications.length === 0 ? (
        <p className="text-gray-400 text-center text-lg">
          You have no new notifications!
        </p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-5 mb-4 rounded-lg shadow-lg transition duration-300 ${
              notification.isRead ? 'bg-gray-100' : 'bg-indigo-100'
            }`}
          >
            <p className="text-lg font-semibold text-gray-800">
              {notification.message}
            </p>
            <span className="block text-sm text-gray-600 mt-2">
              {new Date(notification.timestamp).toLocaleString()}
            </span>
            {!notification.read && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="mt-4 px-5 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition duration-200 ease-in-out shadow-md"
              >
                Mark as Read
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export { NotificationsList };
