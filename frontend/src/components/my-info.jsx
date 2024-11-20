import React, { useState } from 'react';
import { useAuth } from '../context/auth-context';
import { request } from '../api/http';
import userImage from '../images/user.png';

const MyInfo = () => {
  const { auth, setAuth } = useAuth(); // Access token and role from auth
  const [username, setUsername] = useState(auth.username || '');
  const [role, setRole] = useState(auth.role || ''); // Initialize with the role from auth
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const roleDisplayMap = {
    PROJECT_MANAGER: 'Project Manager',
    TEAM_MEMBER: 'Team Member',
    // Add more roles as needed
  };

  const getRoleDisplayName = (role) =>
      roleDisplayMap[role] ||
      role
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());

  // Handles the role change
  const handleRoleChange = async (newRole) => {
    try {
      setIsLoading(true);
      setError('');

      // Request to update role
      const response = await request('patch', `/users/role`, { role: newRole });

      // Update role in component's state
      setRole(response.data.role);
      setUsername(response.data.username);

      // Update the auth context
      setAuth((prevAuth) => ({
        ...prevAuth,
        role: response.data.role, // Make sure to use the role from the response
        username: response.data.username,
      }));

      // Persist the new role in localStorage
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('username', response.data.username);

    } catch (err) {
      console.error('Error while updating role:', err);
      setError('Error updating role. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading if role not available
  if (!role) {
    return <div className="text-white">Loading user information...</div>;
  }

  return (
       <div className="container mx-auto p-8 bg-gray-900 rounded-lg shadow-lg text-white max-w-lg">
         <h1 className="text-3xl font-bold mb-6 text-indigo-500">My Info</h1>

         <div className="flex items-center mb-6">
           <img src={userImage} alt="User" className="w-24 h-24 rounded-full border-4 border-indigo-500 mr-4" />
           <div>
             <p className="text-xl"><strong>Role:</strong> {getRoleDisplayName(role)}</p>
             <p className="text-xl">Username: {auth.username}</p>
           </div>
         </div>

         {isLoading && <p className="text-indigo-400">Updating role...</p>}
       </div>
     );
   };

   export { MyInfo };
