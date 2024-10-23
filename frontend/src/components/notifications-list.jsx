import React from 'react';

const NotificationsList = ({ notifications, onMarkAsRead }) => {
  return (
    <div className="w-full max-w-lg mx-auto p-4">
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center">You have no new notifications!</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 mb-4 rounded-md shadow ${
              notification.isRead ? 'bg-gray-200' : 'bg-white'
            }`}
          >
            <p className="text-lg font-medium">{notification.message}</p>
            <span className="block text-sm text-gray-600 mt-1">
              {new Date(notification.timestamp).toLocaleString()}
            </span>
            {!notification.isRead && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
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
