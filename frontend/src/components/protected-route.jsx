import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { auth } = useAuth();

  if (!auth.token) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  if (requiredRole && auth.role !== requiredRole) {
    // If the user doesn't have the correct role, redirect to the home page or show an unauthorized message
    return <Navigate to="/" />;
  }

  return children;
};
