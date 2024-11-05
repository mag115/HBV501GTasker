import React, { useState, useEffect } from 'react';
import { request } from '../api/http';
import { useAuth } from '../context/auth-context';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await request('get', '/tasks');
        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          throw new Error('Invalid response format');
        }
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

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return <p>No tasks available yet. Add a task!</p>;
    }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      await request('patch', `/tasks/${taskId}/status`, { status: newStatus });
      console.log(`Updated task ${taskId} status to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handlePriorityChange = async (taskId, newPriority) => {
    try {
      await request('patch', `/tasks/${taskId}/priority`, { priority: newPriority });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, priority: newPriority } : task
        )
      );
      console.log(`Updated task ${taskId} priority to ${newPriority}`);
    } catch (error) {
      console.error('Failed to update priority:', error);
      alert('Failed to update priority. Please try again.');
    }
  };

  const handleSendReminder = async (taskId) => {
    try {
      await request('post', `/tasks/${taskId}/reminder`);
      alert('Reminder sent successfully!');
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('Failed to send reminder. Please try again.');
    }
  };

  const renderTask = (task) => (
    <div key={task.id} className="max-w-sm rounded overflow-hidden shadow-lg bg-white mb-4">
      <div className="px-6 py-4">
        <div className="font-bold capitalize text-2xl mb-2">{task.title}</div>
        <p className="text-gray-700 text-base mb-5">{task.description}</p>

        {/* Display the task's progress status */}
        <p className="text-sm mb-2">
          <strong>Status:</strong>{" "}
          {task.progressStatus === "Completed" ? (
            <span className="text-green-500">Completed</span>
          ) : task.progressStatus === "On Track" ? (
            <span className="text-blue-500">On Track</span>
          ) : (
            <span className="text-red-500">Behind Schedule</span>
          )}
        </p>

        <label className="text-black-500">Update Status: </label>
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
          Deadline: {task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline set"}
        </p>

        <select
          className="text-black-500 mr-20"
          value={task.priority}
          onChange={(e) => handlePriorityChange(task.id, e.target.value)}
        >
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>

        {auth.role === 'PROJECT_MANAGER' && (
          <button
            className="mt-2 bg-black text-white py-1 px-4 rounded"
            onClick={() => handleSendReminder(task.id)}
          >
            Send reminder
          </button>
        )}
      </div>
    </div>
  );

  const toDoTasks = tasks.filter((task) => task.status === 'To-do');
  const ongoingTasks = tasks.filter((task) => task.status === 'Ongoing');
  const doneTasks = tasks.filter((task) => task.status === 'Done');

  return (
    <div className="flex space-x-8 m-4">
      <div className="w-1/3">
        <h2 className="text-white text-center font-bold mb-4">To-do</h2>
        {toDoTasks.map(renderTask)}
      </div>
      <div className="w-1/3">
        <h2 className="text-white text-center font-bold mb-4">Ongoing</h2>
        {ongoingTasks.map(renderTask)}
      </div>
      <div className="w-1/3">
        <h2 className="text-white text-center font-bold mb-4">Done</h2>
        {doneTasks.map(renderTask)}
      </div>
    </div>
  );
};

export { TaskList };
