import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    role: null,  // Store role as a string
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');  // Retrieve role from localStorage as a string
    if (token && role) {
      setAuth({ token, role });  // Set both token and role in state
    }
  }, []);

  const login = (data) => {
    const { token, role } = data;  // Extract token and role from the data object
    console.log('token', token);   // Debug token
    console.log('role', role);     // Debug role

    // Set both token and role in auth state
    setAuth({ token, role });

    // Store token and role in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  };

  const logout = () => {
    setAuth({ token: null, role: null });  // Clear both token and role from state
    localStorage.removeItem('token');
    localStorage.removeItem('role');  // Clear role from localStorage
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
