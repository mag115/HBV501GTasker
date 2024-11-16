import React, { useState, useEffect } from 'react';
import { NotificationsList } from '../components/notifications-list';
import { Page } from '../components/page';
import { request } from '../api/http';
import { useAuth } from '../context/auth-context';
import { useNotifications } from '../context/notification-context';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { auth } = useAuth(); // Get the logged-in user info from context
    const { fetchUnreadNotifications } = useNotifications();

useEffect(() => {
  // Ensure auth object exists, user is authenticated, and userId is present
  if (auth?.token && auth?.userId) {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        console.log('Fetching notifications for user ID:', auth.userId);
        const response = await request('get', `/notifications/${auth.userId}`);
        setNotifications(response.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  } else {
    console.warn('User not authenticated or no userId present.');
  }
}, [auth?.token, auth?.userId]);

  const handleMarkAsRead = async (id) => {
    try {
      await request('patch', `/notifications/${id}/read`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      if (auth?.userId && auth?.token) {
            fetchUnreadNotifications(auth.userId, auth.token);
          } else {
            console.warn('Cannot fetch notifications - userId or token missing.');
          }
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Page>
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
