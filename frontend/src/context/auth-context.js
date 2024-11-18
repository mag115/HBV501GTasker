import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state with values from localStorage, with fallbacks
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    userId: localStorage.getItem('userId') || null,
    username: localStorage.getItem('username') || null,
  });

  const login = (data) => {
  console.log('Login called with data:', data);
    const { token, role, userId, username } = data;
    setAuth({ token, role, userId, username});
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    console.log('Username saved to localStorage:', localStorage.getItem('username'));
     console.log('Login data:', data);
  };

  console.log('UserId saved to localStorage:', localStorage.getItem('userId'));
  console.log('Username saved to localStorage:', localStorage.getItem('username'));
  console.log('auth set at', auth);

  const logout = () => {
    setAuth({ token: null, role: null, userId: null, username:null });
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  };

  // Effect to rehydrate auth state from localStorage if changed
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');


    if (storedToken && storedRole && storedUserId && storedUsername) {
      setAuth({ token: storedToken, role: storedRole, userId: storedUserId, username: storedUsername });
    } else {
      setAuth({ token: null, role: null, userId: null, username: null });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
