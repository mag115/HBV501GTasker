import React, { useEffect, useState } from 'react';
import { request } from '../api/http';

const MyTasks = () => {
  const [myTasks, setMyTasks] = useState([]);  // Tasks assigned to the current user
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);     // Error state

  useEffect(() => {
    // Fetch tasks assigned to the logged-in user
    const fetchMyTasks = async () => {
      try {
        const response = await request('get', '/tasks/assigned'); // Fetch tasks assigned to the user
        setMyTasks(response.data);
      } catch (error) {
        console.error('Error fetching my tasks:', error);
        setError('Failed to fetch tasks assigned to you.');
      } finally {
        setLoading(false);  // Stop loading once fetch is complete
      }
    };

    fetchMyTasks();
  }, []);

  // Render loading state
  if (loading) {
    return <p>Loading tasks...</p>;
  }

  // Render error state
  if (error) {
    return <p>{error}</p>;
  }

  // Render the UI
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>

      {/* Render tasks assigned to the user */}
      {myTasks.length > 0 ? (
        myTasks.map((task) => (
          <div key={task.id} className="bg-white p-4 shadow-md rounded-lg mb-4">
            <h2 className="text-xl font-bold">{task.title}</h2>
            <p>Description: {task.description}</p>
            <p>Priority: {task.priority}</p>
            <p>Status: {task.status}</p>
            <p>Deadline: {new Date(task.deadline).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p>No tasks assigned to you.</p>
      )}
    </div>
  );
};

export { MyTasks };
