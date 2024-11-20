import React, { createContext, useState, useContext, useEffect } from 'react';
import { request } from '../api/http';
import { useAuth } from './auth-context';

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { auth } = useAuth(); // Consume Auth context

  const fetchUnreadNotifications = async (userId, token) => {
    if (!userId || !token) return;
    try {
      const response = await request('get', `/notifications/${userId}/unread`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUnreadCount(response.data.length);
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();
  }, [auth]);

  const incrementUnreadCount = () => {
    setUnreadCount((prevCount) => prevCount + 1);
  };

  const decrementUnreadCount = () => {
    setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
  };

  return (
    <NotificationsContext.Provider
      value={{ unreadCount, fetchUnreadNotifications, incrementUnreadCount, decrementUnreadCount }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
