import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import { request } from '../api/http';

const ProjectForm = () => {
  const { auth } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    // Fetch all users to assign them to projects
    const fetchUsers = async () => {
      try {
        const response = await request('get', '/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await request('post', '/projects', {
        name,
        description,
        userIds: selectedUsers,
      });
      console.log('Project created:', response.data);
      setName('');
      setDescription('');
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Project</h1>
      <form onSubmit={handleCreateProject} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Project Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="users" className="block text-sm font-medium text-gray-700">
            Assign Users
          </label>
          <select
            id="users"
            multiple
            value={selectedUsers}
            onChange={(e) => setSelectedUsers([...e.target.selectedOptions].map((o) => o.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700"
        >
          Create Project
        </button>
      </form>
    </div>
  );
};

export { ProjectForm };