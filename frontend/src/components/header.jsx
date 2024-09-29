import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
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
          <li>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                isActive ? 'text-gray-200 font-bold' : 'hover:text-gray-200'
              }
            >
              Add Task
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tasklist"
              className={({ isActive }) =>
                isActive ? 'text-gray-200 font-bold' : 'hover:text-gray-200'
              }
            >
              Task List
            </NavLink>
          </li>
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
        </ul>
      </nav>
    </header>
  );
};

export { Header };
