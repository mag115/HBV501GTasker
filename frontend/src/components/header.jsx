import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { request } from '../api/http';

const Header = () => {
  const { auth, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (auth?.token && auth.user?.id) {
        try {
          const response = await request('get', `/notifications/${auth.user.id}?filter=unread`);
          setUnreadCount(response.data.length);
        } catch (error) {
          console.error('Error fetching unread notifications:', error);
        }
      }
    };

    const fetchProjects = async () => {
          if (auth?.token) {
            try {
              const response = await request('get', '/projects');
              setProjects(response.data);
              if (response.data.length > 0) {
                setSelectedProject(response.data[0].id); // Default to the first project
              }
            } catch (error) {
              console.error('Error fetching projects:', error);
            }
          }
        };
        
    fetchUnreadNotifications();
  }, [auth]);

const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
    // skoða þetta kannski betur
  };

  return (
    <header className="bg-indigo-600 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-white hover:text-gray-200">
          Tasker Home
        </NavLink>
        <ul className="flex space-x-6 text-white">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'text-gray-200 font-semibold' : 'hover:text-gray-300'
              }
            >
              Home
            </NavLink>
          </li>
          {auth?.token && (
            <li>
              <select
                value={selectedProject}
                onChange={handleProjectChange}
                className="bg-indigo-500 text-white rounded px-3 py-1"
              >
                <option value="" disabled>
                  Select Project
                </option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </li>
          )}
          {auth?.token ? (
            <>
              {auth.role === 'PROJECT_MANAGER' && (
                <>
                  <li>
                    <NavLink to="/create-task" className="hover:text-gray-300">
                      Create Task
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/my-tasks" className="hover:text-gray-300">
                      My Tasks
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/task-list" className="hover:text-gray-300">
                      All Tasks
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/project" className="hover:text-gray-300">
                      Project Report
                    </NavLink>
                  </li>
                </>
              )}

              {auth.role === 'TEAM_MEMBER' && (
                <>
                  <li>
                    <NavLink to="/my-tasks" className="hover:text-gray-300">
                      My Tasks
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/task-list" className="hover:text-gray-300">
                      All Tasks
                    </NavLink>
                  </li>
                </>
              )}

              <li>
                <NavLink to="/notifications" className="hover:text-gray-300 relative">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/myinfo" className="hover:text-gray-300">
                  My Info
                </NavLink>
              </li>
              <li>
                <button onClick={logout} className="hover:text-gray-300">
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className="hover:text-gray-300">
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/signup" className="hover:text-gray-300">
                  Sign Up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export { Header };
