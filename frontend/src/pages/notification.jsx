import React, { useState, useEffect } from 'react';
import { NotificationsList } from '../components/notifications-list';
import { Page } from '../components/page';
import { request } from '../api/http';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Example: Mock API call to fetch notifications
  useEffect(() => {
    // Replace with actual API call
    const fetchNotifications = async () => {
      // Mocked data; replace with an API call
      const mockData = [
        {
          id: 1,
          message: 'Your task was completed successfully.',
          isRead: false,
          timestamp: '2024-10-19T10:15:30',
        },
        {
          id: 2,
          message: 'New comment on your post.',
          isRead: true,
          timestamp: '2024-10-18T09:05:10',
        },
      ];
      setNotifications(mockData);
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = (id) => {
    // Update state to mark the notification as read
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleSendTaskNotification = async () => {
    setLoading(true);
    try {
      const response = await request('post', '/notifications/send');
      alert('Task assignment notification sent to all users.');
    } catch (error) {
      console.error('Error sending task notification:', error);
      alert('Failed to send notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <button
        onClick={handleSendTaskNotification}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Task Assignment Notification'}
      </button>
      <h1 className="text-white text-2xl font-semibold text-center mb-6">
        Notifications
      </h1>
      <NotificationsList
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
      />
    </Page>
  );
};

export { NotificationPage };
