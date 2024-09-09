import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <div className="text-xl font-bold">Tasker App</div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:text-gray-200">
              Home
            </Link>
          </li>
          <li>
            <Link to="/tasks" className="hover:text-gray-200">
              Add Task
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export { Header };
