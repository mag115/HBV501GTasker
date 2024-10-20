import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import { request } from '../api/http';
import userImage from '../images/user.png'; // Ensure the correct path to your image

const MyInfo = () => {
  const { auth, setAuth } = useAuth(); // Access token and role from auth
  const [role, setRole] = useState(auth.role || ''); // Initialize with the role from auth
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to handle role change
  const handleRoleChange = async (newRole) => {
      try {
          setIsLoading(true);
          const response = await request('patch', `/users/role`, { role: newRole });

          // Ensure the response contains the correct data
          console.log('Response:', response.data);

          setRole(response.data.role);

          // Update auth state
          setAuth((prevAuth) => ({
              ...prevAuth,
              user: { ...prevAuth.user, role: newRole },
          }));
      } catch (err) {
          // Log the error for debugging
          console.error('Error while updating role:', err);

          setError('Error updating role. Please try again.');
      } finally {
          setIsLoading(false);
      }
  };


  // Display loading text if role is not yet available
  if (!role) {
    return <div className="text-white">Loading user information...</div>;
  }

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">My Role</h1>

      {/* Display user image and role */}
      <div className="flex items-center mb-6">
        <img src={userImage} alt="User" className="w-24 h-24 rounded-full mr-4" />
        <div>
          <p><strong>Role:</strong> {role}</p>
        </div>
      </div>

      {/* Allow role change */}
      <div className="mb-6">
        <label className="block text-sm font-bold mb-2" htmlFor="role">Change Role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded"
          disabled={isLoading}
        >
          <option value="TEAM_MEMBER">Team Member</option>
          <option value="PROJECT_MANAGER">Project Manager</option>
        </select>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {isLoading && <p>Updating role...</p>}
    </div>
  );
};

export { MyInfo };
