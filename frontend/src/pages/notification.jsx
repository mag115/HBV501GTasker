import React, { useState, useEffect } from 'react';
import { NotificationsList } from '../components/notifications-list';
import { Page } from '../components/page';
import { request } from '../api/http';
import { useAuth } from '../context/auth-context';  // Assuming you have a context for authentication

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { auth } = useAuth(); // Assuming you have auth context for logged-in user

  // Fetch notifications from the backend on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
        setLoading(true);
        try {
          const response = await request('get', `/notifications/${auth.user.id}`);  // Fetch notifications for the logged-in user
          setNotifications(response.data);
        } catch (err) {
          console.error('Error fetching notifications:', err);
          setError('Failed to load notifications.');
        } finally {
          setLoading(false);
        }
      };

      if (auth.user?.id) {
        fetchNotifications();  // Fetch notifications if user is logged in
      }
    }, [auth.user]);

  // Mark a notification as read in the backend
  const handleMarkAsRead = async (id) => {
    try {
      await request('patch', `/notifications/${id}/read`);  // Endpoint to mark notification as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read.');
    }
  };

  // Send a task assignment notification (for demo purposes)
  const handleSendTaskNotification = async () => {
    setLoading(true);
    try {
      await request('post', '/notifications/send');  // Adjust the endpoint as needed
      alert('Task assignment notification sent.');
    } catch (error) {
      console.error('Error sending task notification:', error);
      alert('Failed to send notification.');
    } finally {
      setLoading(false);
    }
  };

  // Conditional rendering for loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
      <Page>
        {/*
        <button
          onClick={handleSendTaskNotification}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Task Assignment Notification'}
        </button>
        */}
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
