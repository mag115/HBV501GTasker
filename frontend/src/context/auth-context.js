import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state with values from localStorage, with fallbacks
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    userId: localStorage.getItem('userId') || null,
  });

  const login = (data) => {
    const { token, role, userId } = data;
    setAuth({ token, role, userId });
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
  };

  console.log('auth set at', auth);

  const logout = () => {
    setAuth({ token: null, role: null, userId: null });
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  };

  // Effect to rehydrate auth state from localStorage if changed
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('userId');

    if (storedToken && storedRole && storedUserId) {
      setAuth({ token: storedToken, role: storedRole, userId: storedUserId });
    } else {
      setAuth({ token: null, role: null, userId: null });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
