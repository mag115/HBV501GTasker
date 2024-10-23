import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { request } from '../api/http';

const Header = () => {
  const { auth, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (auth?.token && auth.user?.id) {
        try {
          // Pass the userId and filter unread notifications with a query parameter
          const response = await request('get', `/notifications/${auth.user.id}?filter=unread`);
          setUnreadCount(response.data.length); // Assuming response.data contains the unread notifications array
        } catch (error) {
          console.error('Error fetching unread notifications:', error);
        }
      }
    };

    fetchUnreadNotifications();
  }, [auth]);

  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'text-gray-200 font-bold' : 'hover:text-gray-200')}
        >
          Tasker Home
        </NavLink>
        <ul className="flex space-x-4">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'text-gray-200 font-bold' : 'hover:text-gray-200')}>
              Home
            </NavLink>
          </li>

          {auth?.token ? (
            <>
              {auth.role === 'PROJECT_MANAGER' && (
                <>
                  <li>
                    <NavLink to="/create-task" className="hover:text-gray-200">Create Task</NavLink>
                  </li>
                  <li>
                    <NavLink to="/task-list" className="hover:text-gray-200">All Tasks</NavLink>
                  </li>
                  <li>
                    <NavLink to="/project" className="hover:text-gray-200">Project Report</NavLink>
                  </li>
                </>
              )}

              {auth.role === 'TEAM_MEMBER' && (
                <>
                  <li>
                    <NavLink to="/my-tasks" className="hover:text-gray-200">My Tasks</NavLink>
                  </li>
                  <li>
                    <NavLink to="/task-list" className="hover:text-gray-200">All Tasks</NavLink>
                  </li>
                </>
              )}

              <li>
                <NavLink to="/notifications" className="hover:text-gray-200 relative">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/myinfo" className="hover:text-gray-200">My Info</NavLink>
              </li>
              <li>
                <button onClick={logout} className="hover:text-gray-200">Sign Out</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className="hover:text-gray-200">Login</NavLink>
              </li>
              <li>
                <NavLink to="/signup" className="hover:text-gray-200">Sign Up</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export { Header };
