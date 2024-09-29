import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Tasks } from './pages/tasks';
import { LoginForm } from './components/login-form';
import { SignupForm } from './components/signup-form';
import { ProtectedRoute } from './components/protected-route';
import { Home } from './pages/home';
import { AuthProvider } from './context/auth-context';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <LoginForm />,
  },
  {
    path: '/signup',
    element: <SignupForm />,
  },
  {
    path: '/tasks',
    element: (
      <ProtectedRoute>
        <Tasks />
      </ProtectedRoute>
    ),
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
