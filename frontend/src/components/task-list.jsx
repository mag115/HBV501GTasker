
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

  const toDoTasks = tasks.filter((task) => task.status === 'To-do');
    const ongoingTasks = tasks.filter((task) => task.status === 'Ongoing');
    const doneTasks = tasks.filter((task) => task.status === 'Done');

    const handleStatusChange = (taskId, newStatus) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
      };

  return (
    <ul className="list-disc pl-5">
      {tasks.map((task) => (
        <li key={task.id} className="mb-2">
          <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white mb-4">
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{task.title}</div>
              <p className="text-gray-700 text-base">{task.description}</p>
              <label className="text-gray-500">Status: </label>
              <select className="text-black-500" value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)}>
                <option value="To-do">To-do</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Done">Done</option>
              </select>
              <p className="text-black-500">Deadline: {new Date(task.deadline).toLocaleString()}</p>
              <p className="text-black-500">Priority: {task.priority}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export { TaskList };
