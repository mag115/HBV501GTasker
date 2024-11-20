import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../api/http';
import { useProject } from '../context/project-context';

const TaskForm = () => {
  const { selectedProject } = useProject();
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
  const [estimatedWeeks, setEstimatedWeeks] = useState('');
  const [effortPercentage, setEffortPercentage] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(null);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [task, setTask]=useState([]);
  const [dependency, setDependency] = useState('');
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await request('get', '/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await request('get', '/tasks');
        console.log('Fetched users:', response.data);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const fetchProjects = async () => {
        try {
          const response = await request('get', '/projects');
          setProjects(response.data);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      };

    fetchUsers();
    fetchTasks();
    fetchProjects();
  }, []);

  useEffect(() => {
    const calculateEstimatedDuration = () => {
      const hoursUntilDeadline = deadline ? (new Date(deadline) - new Date()) / (1000 * 60 * 60) : null;

      if (estimatedWeeks && hoursUntilDeadline !== null) {
        // Duration based on estimatedWeeks and cap at the deadline
        const weeksDuration = parseFloat(estimatedWeeks) * 40; // Assume 40 hours per week
        return Math.min(weeksDuration, hoursUntilDeadline);
      }

      if (effortPercentage && hoursUntilDeadline !== null) {
        // Duration based on effortPercentage and cap at the deadline
        const calculatedDuration = hoursUntilDeadline * (parseFloat(effortPercentage) / 100);
        return Math.min(calculatedDuration, hoursUntilDeadline);
      }

      return null;
    };

    setEstimatedDuration(calculateEstimatedDuration());
  }, [estimatedWeeks, effortPercentage, deadline]);

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
      estimatedWeeks: estimatedWeeks ? parseInt(estimatedWeeks) : null,
      effortPercentage: effortPercentage ? parseFloat(effortPercentage) : null,
      estimatedDuration,
      dependency,
      projectId: parseInt(selectedProject),
    };
    console.log(dependency);
    try {
      const res = await request('post', `/tasks?assignedUserId=${assignedUser}&projectId=${selectedProject}`, newTask);
      if (res.status === 200) {
        setTaskId(res.data.id);
        setResponseMessage('Task successfully created!');
        setIsTaskCreated(true);
        setTitle('');
        setDescription('');
        setDeadline('');
        setReminderSent(false);
        setPriority('');
        setAssignedUser('');
        setEstimatedWeeks('');
        setEffortPercentage('');
        setDependency(null);
        setEstimatedDuration(null);
        setProjectId('');
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-center text-indigo-600 mb-6">Add Task</h2>

        {isTaskCreated ? (
          <div className="text-center">
            <p className="text-green-600 font-medium mb-4">{responseMessage}</p>
            <p className="text-gray-700 mb-6">Task ID: {taskId}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleBackToHome}
                className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Back to Home Page
              </button>
              <button
                onClick={handleViewTaskList}
                className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
              >
                View in Task List
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="deadline">
                Deadline
              </label>
              <input
                id="deadline"
                type="datetime-local"
                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="priority">
                Priority
              </label>
              <select
                id="priority"
                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-300"
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
              <label className="block text-gray-700 text-sm font-semibold mb-1">Estimated Duration</label>
              <p className="text-gray-600 text-sm mb-2">
                Choose either estimated weeks or effort percentage (not both).
              </p>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="estimatedWeeks">
                  Estimated Weeks
                </label>
                <input
                  id="estimatedWeeks"
                  type="number"
                  step="1"
                  min="0"
                  className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                  value={estimatedWeeks}
                  onChange={(e) => {
                    setEstimatedWeeks(e.target.value);
                    setEffortPercentage('');
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="effortPercentage">
                  Effort Percentage (% of total time until deadline)
                </label>
                <input
                  id="effortPercentage"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                  value={effortPercentage}
                  onChange={(e) => {
                    setEffortPercentage(e.target.value);
                    setEstimatedWeeks('');
                  }}
                />
              </div>

              <p className="text-gray-700">
                <strong>Calculated Estimated Duration:</strong> {estimatedDuration ? `${estimatedDuration.toFixed(2)} hours` : 'N/A'}
              </p>
            </div>


            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-1">Assign User</label>
              <select
                value={assignedUser}
                onChange={(e) => setAssignedUser(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                required
              >
                <option value="">Select a User</option>
                <select
                  value={assignedUser}
                  onChange={(e) => setAssignedUser(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                  required
                >
                  <option value="">Select a User</option>
                  {Array.isArray(users) && users.map((user) => (
                    <option key={user.id} value={user.id}>{user.username}</option>
                  ))}
                </select>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.username}</option>
                ))}
              </select>
            </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">Dependencies</label>
                          <select
                            value={dependency}
                            onChange={(e) => setDependency(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"

                          >
                            <option value="">Select a task that has to be completed before this one can begin</option>
                            {tasks.map((task) => (
                              <option key={task.id} value={task.id}>{task.title}</option>
                            ))}
                          </select>
                        </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-1">Select Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                required
              >
                <option value="">Select a Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600"
                  checked={reminderSent}
                  onChange={(e) => setReminderSent(e.target.checked)}
                />
                <span className="ml-2 text-gray-700">Send a reminder</span>
              </label>
            </div>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md w-full hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition"
            >
              Add Task
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export { TaskForm };
