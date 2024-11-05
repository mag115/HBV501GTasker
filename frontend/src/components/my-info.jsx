import React, { useState } from 'react';
import { useAuth } from '../context/auth-context';
import { request } from '../api/http';
import userImage from '../images/user.png';

const MyInfo = () => {
  const { auth, setAuth } = useAuth(); // Access token and role from auth
  const [role, setRole] = useState(auth.role || ''); // Initialize with the role from auth
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handles the role change
  const handleRoleChange = async (newRole) => {
    try {
      setIsLoading(true);
      setError('');

      // Request to update role
      const response = await request('patch', `/users/role`, { role: newRole });

      // Update role in component's state
      setRole(response.data.role);

      // Update the auth context
      setAuth((prevAuth) => ({
        ...prevAuth,
        role: response.data.role,  // Make sure to use the role from the response
      }));

      // Persist the new role in localStorage
      localStorage.setItem('role', response.data.role);

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
         <h1 className="text-3xl font-bold mb-6 text-indigo-500">My Role</h1>

         <div className="flex items-center mb-6">
           <img src={userImage} alt="User" className="w-24 h-24 rounded-full border-4 border-indigo-500 mr-4" />
           <div>
             <p className="text-xl"><strong>Role:</strong> {role}</p>
           </div>
         </div>

         <div className="mb-6">
           <label className="block text-sm font-bold mb-2 text-indigo-400" htmlFor="role">Change Role</label>
           <select
             id="role"
             value={role}
             onChange={(e) => handleRoleChange(e.target.value)}
             className="w-full bg-gray-800 text-white p-3 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
             disabled={isLoading}
           >
             <option value="TEAM_MEMBER">Team Member</option>
             <option value="PROJECT_MANAGER">Project Manager</option>
           </select>
           {error && <p className="text-red-500 mt-2">{error}</p>}
         </div>

         {isLoading && <p className="text-indigo-400">Updating role...</p>}
       </div>
     );
   };

   export { MyInfo };