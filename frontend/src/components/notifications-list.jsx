import React from 'react';

const NotificationsList = ({ notifications, onMarkAsRead }) => {
  console.log("Notifications:", notifications); // Debugging log

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      {notifications.length === 0 ? (
        <p className="text-gray-400 text-center text-lg">You have no new notifications!</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-5 mb-4 rounded-lg shadow-lg transition duration-300 ${
              notification.isRead ? 'bg-gray-100' : 'bg-indigo-100'
            }`}
          >
            <p className="text-lg font-semibold text-gray-800">{notification.message}</p>
            <span className="block text-sm text-gray-600 mt-2">
              {new Date(notification.timestamp).toLocaleString()}
            </span>
            {!notification.isRead && (
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
