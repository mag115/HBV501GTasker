import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../api/http';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [reminderSent, setReminderSent] = useState(false);
  const [priority, setPriority] = useState('');
  const [users, setUsers] = useState([]);
  const [assignedUser, setAssignedUser] = useState('');
  const [isTaskCreated, setIsTaskCreated] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [taskId, setTaskId] = useState(null); // State for the task ID
  const[timeSpent, setTimeSpent]=useState('');

  const navigate = useNavigate();
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [estimatedWeeks, setEstimatedWeeks] = useState('');
  const [effortPercentage, setEffortPercentage] = useState('');

  // Fetch the list of users from the backend when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await request('get', '/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      title,
      description,
      deadline: new Date(deadline),
      reminderSent,
      priority,
      status: 'To-do',
      timeSpent:0,
      elapsedTime:0,
      //estimatedDuration: parseFloat(estimatedDuration),
    };

    try {
        // Create the task first
        const res = await request('post', `/tasks?assignedUserId=${assignedUser}`, newTask);
        if (res.status === 200) {
          const createdTaskId = res.data.id;
          setTaskId(createdTaskId); // Set the task ID from the response

          // Send the estimated duration info in a separate request
          const durationData = {
            estimatedWeeks: estimatedWeeks ? parseInt(estimatedWeeks) : null,
            effortPercentage: effortPercentage ? parseFloat(effortPercentage) : null,
          };
          await request('post', `/tasks/${createdTaskId}/duration`, durationData);

          setResponseMessage('Task successfully created!');
          setIsTaskCreated(true);
          // Clear the form fields
          setTitle('');
          setDescription('');
          setDeadline('');
          setReminderSent(false);
          setPriority('');
          setAssignedUser('');
          setEstimatedWeeks('');
          setEffortPercentage('');
        } else {
          setResponseMessage('Failed to create task.');
        }
      } catch (error) {
        console.error('Error creating task:', error);
        setResponseMessage('Error creating task.');
      }
    };

  const handleViewTaskList = () => {
    navigate('/task-list');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Task</h2>

        {isTaskCreated ? (
          <div>
            <p className="text-green-500 text-center mb-6">{responseMessage}</p>
            <p className="text-center">Task ID: {taskId}</p> {/* Display the task ID */}
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadline">
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

            {/* Dropdown to select the user to assign the task to */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Assign User</label>
              <select
                value={assignedUser}
                onChange={(e) => setAssignedUser(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              >
                <option value="">Select a User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.username}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estimatedWeeks">
                Estimated Duration (weeks for 100% effort)
              </label>
              <input
                id="estimatedWeeks"
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={estimatedWeeks}
                onChange={(e) => {
                  setEstimatedWeeks(e.target.value);
                  setEffortPercentage(''); // Clear effortPercentage if estimatedWeeks is set
                }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="effortPercentage">
                Effort Percentage (percentage of time until deadline)
              </label>
              <input
                id="effortPercentage"
                type="number"
                step="0.1"
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={effortPercentage}
                onChange={(e) => {
                  setEffortPercentage(e.target.value);
                  setEstimatedWeeks(''); // Clear estimatedWeeks if effortPercentage is set
                }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Reminder Sent</label>
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