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
        console.log(response.data);
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

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const toDoTasks = tasks.filter((task) => task.status === 'To-do');
  const ongoingTasks = tasks.filter((task) => task.status === 'Ongoing');
  const doneTasks = tasks.filter((task) => task.status === 'Done');

  const handleSendReminder = async (taskId) => {
    try {
      await request('post', `/tasks/${taskId}/reminder`);
      alert('Reminder sent successfully!');
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('Failed to send reminder. Please try again.');
    }
  };

  const geraTask = (task) => (
    <div
      key={task.id}
      className="max-w-sm rounded overflow-hidden shadow-lg bg-white mb-4"
    >
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{task.title}</div>
        <p className="text-gray-700 text-base">{task.description}</p>
        <label className="text-gray-500">Status: </label>
        <select
          className="text-black-500"
          value={task.status}
          onChange={(e) => handleStatusChange(task.id, e.target.value)}
        >
          <option value="To-do">To-do</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Done">Done</option>
        </select>
        <p className="text-black-500">
          Deadline: {new Date(task.deadline).toLocaleString()}
        </p>
        <p className="text-black-500">Priority: {task.priority}</p>
        <button
          className="mt-2 bg-black text-white py-1 px-4 rounded"
          onClick={() => handleSendReminder(task.id)}
        >
          Send reminder
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex space-x-8 m-4">
      <div className="w-1/3">
        <h2 className="text-white text-center font-bold mb-4">To-do</h2>
        {toDoTasks.map(geraTask)}
      </div>
      <div className="w-1/3">
        <h2 className="text-white text-center font-bold mb-4">Ongoing</h2>
        {ongoingTasks.map(geraTask)}
      </div>
      <div className="w-1/3">
        <h2 className="text-white text-center font-bold mb-4">Done</h2>
        {doneTasks.map(geraTask)}
      </div>
    </div>
  );
};

export { TaskList };
