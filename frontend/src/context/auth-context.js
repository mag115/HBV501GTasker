import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuth({ token });
    }
  }, []);

  const login = (token, user) => {
    console.log('token', token);
    console.log('user', user);
    setAuth({ token, user });
    localStorage.setItem('token', token.token);
  };

  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem('token');
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
