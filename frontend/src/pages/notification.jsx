import React, { useState, useEffect } from 'react';
import { NotificationsList } from '../components/notifications-list';
import { Page } from '../components/page';
import { request } from '../api/http';
import { useAuth } from '../context/auth-context';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { auth } = useAuth(); // Get the logged-in user info from context

  // Fetch notifications from the backend when the component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await request('get', `/notifications/${auth.user.id}`);  // Fetch notifications for the logged-in user

        // Log the response to verify it's being fetched correctly
        console.log("Fetched notifications:", response.data);

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

  // Mark a notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await request('patch', `/notifications/${id}/read`);  // Call the API to mark notification as read
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

  // Conditional rendering for loading and error states
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
