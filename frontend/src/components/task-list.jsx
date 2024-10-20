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

  const handleStatusChange = async (taskId, newStatus) => {
      try {
          // Update the task status in the state
          setTasks((prevTasks) =>
              prevTasks.map((task) =>
                  task.id === taskId ? { ...task, status: newStatus } : task
              )
          );

          // Send the updated status to the server
          await request('patch', `/tasks/${taskId}/status`, { status: newStatus });

          // Re-fetch tasks to ensure the latest data from the server
          //const updatedResponse = await request('get', '/tasks');
          //setTasks(updatedResponse.data);

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
        <div className="font-bold capitalize text-2xl mb-2">{task.title}</div>
        <p className="text-gray-700 text-base mb-5">{task.description}</p>
        <label className="text-black-500">Status: </label>
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
        <select
            className="text-black-500 mr-20"
            value={task.priority}
            onChange={(e) => handlePriorityChange(task.id, e.target.value)}
            >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
        </select>
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
        <h2 className="text-white  text-center font-bold mb-4 ">To-do</h2>
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
