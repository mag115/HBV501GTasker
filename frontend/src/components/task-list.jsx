import React, { useEffect, useState } from 'react';
import { request } from '../api/http';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await request('get', '/tasks');
        setTasks(response.data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (tasks.length === 0) {
    return <p>No tasks available yet. Add a task!</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
      <ul className="list-disc pl-5">
        {tasks.map((task) => (
          <li key={task.id} className="mb-2">
            <h3 className="font-bold">{task.title}</h3>
            <p>{task.description}</p>
            <p className="text-gray-500">
              Deadline: {new Date(task.deadline).toLocaleString()}
            </p>
            {task.reminderSent && (
              <p className="text-green-500">Reminder sent!</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export { TaskList };
