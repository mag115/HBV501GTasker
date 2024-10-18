import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
    role: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    if (token && role && user) {
          setAuth({ token, user: JSON.parse(user), role }); // Parse user object from string
    }
  }, []);

  const login = (token, user, role) => {
    console.log('token', token);
    console.log('user', user);
    console.log('role', role);
    setAuth({ token, user, role });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user)); // Save the user as a string
    localStorage.setItem('role', role); // Save role in localStorage
  };


  const logout = () => {
    setAuth({ token: null, user: null, role: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
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
