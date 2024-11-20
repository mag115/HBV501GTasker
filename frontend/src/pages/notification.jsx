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
    console.log('I TRIED GETTING');
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        console.log('auth.userId', auth);
        const response = await request('get', `/notifications/${auth.userId}`); // Fetch notifications for the logged-in user

        // Log the response to verify it's being fetched correctly
        console.log('Fetched notifications:', response.data);

        setNotifications(response.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [auth.user]);

  const handleMarkAsRead = async (id) => {
    try {
      await request('patch', `/notifications/${id}/read`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
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
