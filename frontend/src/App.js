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
import { ProjectFormPage } from './pages/create-project';
import { ProjectPage } from './pages/project';
import { ProjectProvider } from './context/project-context';

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
    path: '/create-project', // Add the new route here
    element: (
        <ProtectedRoute requiredRole="PROJECT_MANAGER">
        <ProjectFormPage />
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
      <ProtectedRoute>
        <MyTasksPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/projects/:id',
    element: (
        <ProtectedRoute>
          <ProjectPage />
        </ProtectedRoute>
    ),
  },
]);

const App = () => {
  return (
    <AuthProvider>
        <ProjectProvider>
            <RouterProvider router={router} />
        </ProjectProvider>
    </AuthProvider>
  );
};

export default App;

