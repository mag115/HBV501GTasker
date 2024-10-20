import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/auth-context'; // Import the useAuth hook

const Header = () => {
  const { auth, logout } = useAuth(); // Access authentication state and logout function

  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'text-gray-200 font-bold' : 'hover:text-gray-200'
          }
        >
          Tasker Home
        </NavLink>
        <ul className="flex space-x-4">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'text-gray-200 font-bold' : 'hover:text-gray-200'
              }
            >
              Home
            </NavLink>
          </li>

          {auth?.user?.role === 'PROJECT_MANAGER' && (
            <>
              <li>
                <NavLink
                  to="/tasks"
                  className={({ isActive }) =>
                    isActive ? 'text-gray-200 font-bold' : 'hover:text-gray-200'
                  }
                >
                  Create Task
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/task-list"
                  className={({ isActive }) =>
                    isActive ? 'text-gray-200 font-bold' : 'hover:text-gray-200'
                  }
                >
                  All Tasks
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/project"
                  className={({ isActive }) =>
                    isActive ? 'text-gray-200 font-bold' : 'hover:text-gray-200'
                  }
                >
                  Project Report
                </NavLink>
              </li>
            </>
          )}

          {auth?.user?.role === 'TEAM_MEMBER' && (
            <>
              <li>
                <NavLink
                  to="/my-tasks"
                  className={({ isActive }) =>
                    isActive ? 'text-gray-200 font-bold' : 'hover:text-gray-200'
                  }
                >
                  My Tasks
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/task-list"
                  className={({ isActive }) =>
                    isActive ? 'text-gray-200 font-bold' : 'hover:text-gray-200'
                  }
                >
                  All Tasks
                </NavLink>
              </li>
            </>
          )}

          {auth?.token ? (
            <>
              <li>
                <NavLink
                  to="/myinfo"
                  className={({ isActive }) =>
                    isActive ? 'text-gray-200 font-bold' : 'hover:text-gray-200'
                  }
                >
                  My Info
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/notifications"
                  className={({ isActive }) =>
                    isActive ? 'text-gray-200 font-bold' : 'hover:text-gray-200'
                  }
                >
                  Notifications
                </NavLink>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="text-white hover:text-gray-200"
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? 'text-gray-200 font-bold' : 'hover:text-gray-200'
                  }
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive ? 'text-gray-200 font-bold' : 'hover:text-gray-200'
                  }
                >
                  Signup
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
