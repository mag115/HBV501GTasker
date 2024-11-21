import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
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
import { NotificationsProvider } from './context/notification-context';
import { ProjectFormPage } from './pages/create-project';
import { ProjectPage } from './pages/project';
import { ProjectProvider } from './context/project-context';

const App = () => {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <ProjectProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/create-task"
                element={
                  <ProtectedRoute requiredRole="PROJECT_MANAGER">
                    <TaskFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-project"
                element={
                  <ProtectedRoute requiredRole="PROJECT_MANAGER">
                    <ProjectFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/project"
                element={
                  <ProtectedRoute requiredRole="PROJECT_MANAGER">
                    <ProjectReportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/task-list"
                element={
                  <ProtectedRoute>
                    <TaskListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/myinfo"
                element={
                  <ProtectedRoute>
                    <MyInfoPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-tasks"
                element={
                  <ProtectedRoute>
                    <MyTasksPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <ProtectedRoute>
                    <ProjectPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </HashRouter>
        </ProjectProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
};

export default App;
