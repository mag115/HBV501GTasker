import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { request } from '../api/http';
import { Page } from '../components/page';

const ProjectPage = () => {
  const { id } = useParams(); // Get the project ID from the URL
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await request('get', `/projects/${id}`);
        setProject(response.data);
      } catch (error) {
        console.error('Error fetching project:', error);
        alert('Failed to load project data.');
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await request('get', '/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchProject();
    fetchUsers();
  }, [id]);

  const handleAddMember = async () => {
    try {
      if (!selectedUserId) {
        setErrorMessage('Please select a user to add.');
        return;
      }
      await request('post', `/projects/${id}/add-member`, { userId: selectedUserId });
      setSuccessMessage('Member added successfully.');
      setErrorMessage('');
      setSelectedUserId('');
      // Refresh the project data to update the members list
      const response = await request('get', `/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      console.error('Error adding member:', error);
      setErrorMessage('Failed to add member.');
      setSuccessMessage('');
    }
  };

  if (!project || !users) {
    return (
      <Page>
        <div className="text-white text-center mt-8">Loading project details...</div>
      </Page>
    );
  }

  // Compute non-member users
  const nonMemberUsers = users.filter(
    (user) => !project.members.some((member) => member.id === user.id)
  );

  return (
    <Page>
      <div className="container mx-auto px-4 mt-8">
        {/* Project Name and Description */}
        <h1 className="text-3xl font-bold text-white mb-4">{project.name}</h1>
        <p className="text-lg text-slate-300 mb-6">{project.description}</p>

        {/* Current Members */}
        <h2 className="text-2xl font-semibold text-white mb-4">Current Members</h2>
        {project.members && project.members.length > 0 ? (
          <ul className="list-disc list-inside mb-6">
            {project.members.map((member) => (
              <li key={member.id} className="text-slate-300">
                {member.username}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-300 mb-6">No members in this project.</p>
        )}

        {/* Add Member Section */}
        <h2 className="text-2xl font-semibold text-white mb-4">Add Member</h2>
        {nonMemberUsers.length > 0 ? (
          <div className="flex items-center mb-6">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="bg-gray-700 text-white p-2 rounded mr-4"
            >
              <option value="">Select a user</option>
              {nonMemberUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddMember}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Add Member
            </button>
          </div>
        ) : (
          <p className="text-slate-300 mb-6">No users available to add.</p>
        )}

        {/* Success and Error Messages */}
        {successMessage && (
          <p className="text-green-500 mb-6">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-500 mb-6">{errorMessage}</p>
        )}
      </div>
    </Page>
  );
};

export { ProjectPage };
