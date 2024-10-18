import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Tasks } from './pages/tasks';
import { Login } from './pages/login';
import { Signup } from './pages/signup';
import { ProtectedRoute } from './components/protected-route';
import { Home } from './pages/home';
import { AuthProvider } from './context/auth-context';
import { TaskListPage } from './pages/task-list';
import { MyInfoPage } from './pages/myinfo';
import { MyTasksPage } from './pages/mytasks';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/tasks',
    element: (
      <ProtectedRoute>
        <Tasks />
      </ProtectedRoute>
    ),
  },
  {
    path: '/task-list',
    element: (
      <ProtectedRoute>
        <TaskListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/myinfo',
    element: (
      <ProtectedRoute>
        <MyInfoPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/mytasks',
    element: (
      <ProtectedRoute>
        <MyTasksPage />
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
