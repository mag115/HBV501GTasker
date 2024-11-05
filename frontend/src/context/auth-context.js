import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, role: null });

  useEffect(() => {
    // Clear stored auth data on app start to ensure a fresh session each time
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Optional: You can choose to log a message here for debugging
    console.log("Auth data cleared on application start");

    // Further load of any auth data (if necessary) would go here
  }, []);

  const login = (data) => {
    const { token, role } = data;

    setAuth({ token, role });
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  };

  const logout = () => {
    setAuth({ token: null, role: null });
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);