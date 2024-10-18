import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    role: null, // Store role in auth context
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Retrieve role from localStorage
    if (token && role) {
      setAuth({ token, role }); // Set both token and role in auth context
    }
  }, []);

  const login = (token, role) => {
    console.log('token', token);
    console.log('role', role);
    setAuth({ token, role }); // Store role along with token in state
    localStorage.setItem('token', token);
    localStorage.setItem('role', role); // Save role to localStorage
  };

  const logout = () => {
    setAuth({ token: null, role: null }); // Clear role on logout
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Clear role from localStorage
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
