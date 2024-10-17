import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../api/http';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [reminderSent, setReminderSent] = useState(false);
  const [priority, setPriority] = useState('');
  const [isTaskCreated, setIsTaskCreated] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      title,
      description,
      deadline: new Date(deadline),
      reminderSent,
      priority,
      status:'To-do',
    };

    try {
      const res = await request('post', '/tasks', newTask);
      if (res.status === 200) {
        setResponseMessage('Task successfully created!');
        setIsTaskCreated(true); // Set task creation status
        // Clear the form fields
        setTitle('');
        setDescription('');
        setDeadline('');
        setReminderSent(false);
        setPriority('');
      } else {
        setResponseMessage('Failed to create task.');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setResponseMessage('Error creating task.');
    }
  };

  // Handler for "View in Task List" button
  const handleViewTaskList = () => {
    navigate('/tasklist');
  };

  // Handler for "Back to Home Page" button
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Task</h2>

        {/* Show success message and buttons if task is created */}
        {isTaskCreated ? (
          <div>
            <p className="text-green-500 text-center mb-6">{responseMessage}</p>
            <div className="flex justify-between">
              <button
                onClick={handleBackToHome}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 w-full ml-2"
              >
                Back to Home Page
              </button>
              <button
                onClick={handleViewTaskList}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 w-full ml-2"
              >
                View in Task List
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="deadline"
              >
                Deadline
              </label>
              <input
                id="deadline"
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
                Priority
              </label>
              <select
                id="priority"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                required
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Reminder Sent
              </label>
              <input
                type="checkbox"
                className="mr-2 leading-tight"
                checked={reminderSent}
                onChange={(e) => setReminderSent(e.target.checked)}
              />
              <span className="text-sm">Send a reminder</span>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 w-full"
              >
                Add Task
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export { TaskForm };
