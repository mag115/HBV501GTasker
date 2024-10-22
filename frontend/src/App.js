import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { TaskFormPage } from './pages/create-task';
import { Login } from './pages/login';
import { Signup } from './pages/signup';
import { ProtectedRoute } from './components/protected-route';
import { Home } from './pages/home';
import { AuthProvider } from './context/auth-context';
import { TaskListPage } from './pages/task-list';
import { MyInfoPage } from './pages/myinfo';
import { MyTasksPage } from './pages/mytasks';
import { NotificationPage } from './pages/notification';
import { ProjectReportPage } from './pages/projectReport';

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
    path: '/create-task',
    element: (
      <ProtectedRoute requiredRole="PROJECT_MANAGER">
        <TaskFormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/project',
    element: (
      <ProtectedRoute requiredRole="PROJECT_MANAGER">
        <ProjectReportPage />
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
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <NotificationPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-tasks',
    element: (
      <ProtectedRoute requiredRole="TEAM_MEMBER">
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

