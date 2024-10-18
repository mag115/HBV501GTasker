import React, { useEffect, useState } from 'react';
import { request } from '../api/http';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const response = await request('get', '/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchAllTasks();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Project Tasks</h1>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task.id} className="bg-white p-4 shadow-md rounded-lg mb-4">
            <h2 className="text-xl font-bold">{task.title}</h2>
            <p>{task.description}</p>
          </div>
        ))
      ) : (
        <p>No tasks found.</p>
      )}
    </div>
  );
};

export { MyTasks };
