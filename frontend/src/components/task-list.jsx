import React, { useState, useEffect } from 'react';
import { request } from '../api/http';
import { useAuth } from '../context/auth-context';
import { CommentInput } from './comment-input';
import { useNotifications } from '../context/notification-context';
import { useProject } from '../context/project-context';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const { selectedProject } = useProject();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const { fetchUnreadNotifications } = useNotifications();

  useEffect(() => {
    refreshTaskData();
  }, [selectedProject]);

  const refreshTaskData = async () => {
    if (!selectedProject) {
      setTasks([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await request('get', `/tasks?projectId=${selectedProject}`);
      setTasks(response.data);
    } catch (error) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return (
      <p className="text-center text-white">
        No tasks available yet. Add a task!
      </p>
    );
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      await request('patch', `/tasks/${taskId}/status`, { status: newStatus });
      refreshTaskData();
      console.log(`Updated task ${taskId} status to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handlePriorityChange = async (taskId, newPriority) => {
    try {
      await request('patch', `/tasks/${taskId}/priority`, {
        priority: newPriority,
      });
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
      refreshTaskData();
      if (auth?.userId && auth?.token) {
        fetchUnreadNotifications(auth.userId, auth.token);
      } else {
        console.warn('Cannot fetch notifications - userId or token missing.');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('Failed to send reminder. Please try again.');
    }
  };

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete the task?');
    if (confirmDelete) {
      try {
        await request('delete', `/tasks/${taskId}`);
        refreshTaskData();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'text-yellow-500';
      case 'medium':
        return 'text-orange-500';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const renderTask = (task) => (
    <div
      key={task.id}
      className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white mb-4 transition-transform transform hover:scale-105"
    >
      <div className="p-6">
        <h3 className="font-bold capitalize text-2xl text-indigo-600 mb-2">
          {task.title}
        </h3>
        <p className="text-gray-700 mb-4">{task.description}</p>

        {/* Display Assigned User */}
        <p className="text-gray-500 mb-2">
          <strong>Assigned User:</strong>{' '}
          {task.assignedUser ? task.assignedUser.username : 'Unassigned'}
        </p>

        {/* Task Status (non-editable) */}
        <p className="text-gray-500 mb-2">
          <strong>Task Status:</strong> {task.status}
        </p>

        {/* Progress Status */}
        <p className="text-gray-500 mb-2">
          <strong>Progress Status:</strong>{' '}
          {task.progressStatus === 'Completed' ? (
            <span className="text-green-500">Completed</span>
          ) : task.progressStatus === 'On Track' ? (
            <span className="text-blue-500">On Track</span>
          ) : (
            <span className="text-red-500">Behind Schedule</span>
          )}
        </p>

        {/* Display calculated and user-set (manual) progress separately */}
        <p className="text-gray-500 mb-2">
          <strong>Calculated Progress:</strong>{' '}
          {task.progress !== undefined ? `${Math.round(task.progress)}%` : 'N/A'}
        </p>
        <p className="text-gray-500 mb-2">
          <strong>User-Set Progress:</strong>{' '}
          {task.manualProgress !== undefined ? `${Math.round(task.manualProgress)}%` : 'Not set'}
        </p>

        {/* Due Date */}
        <p className="text-gray-500 mb-2">
          <strong>Due Date:</strong>{' '}
          {task.deadline
            ? new Date(task.deadline).toLocaleString()
            : 'No deadline set'}
        </p>

        {/* Priority with color based on value */}
        <p className="text-gray-500 mb-2">
          <strong>Priority:</strong>{' '}
          <span className={getPriorityColor(task.priority)}>
            {task.priority}
          </span>
        </p>

        {/* Priority select dropdown (only for Project Manager) */}
        {auth.role === 'PROJECT_MANAGER' && (
          <>
            <label className="block text-gray-600 mb-1">Update Priority:</label>
            <select
              className="w-full border-gray-300 mb-4 p-2 rounded focus:outline-none"
              value={task.priority}
              onChange={(e) => handlePriorityChange(task.id, e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </>
        )}
        {auth.role === 'PROJECT_MANAGER' && <CommentInput taskId={task.id} />}

        {/* Send Reminder Button for Project Managers */}
        {auth.role === 'PROJECT_MANAGER' && (
          <button
            className="mt-3 w-full py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
            onClick={() => handleSendReminder(task.id)}
          >
            Send Reminder
          </button>
        )}
      </div>
      {auth.role === 'PROJECT_MANAGER' && (
        <button
          className="p-1 bg-red text-white rounded hover:bg-black transition m-2"
          onClick={() => handleDelete(task.id)}
        >
          Delete Task
        </button>
      )}
    </div>
  );

  const toDoTasks = tasks.filter((task) => task.status === 'To-do');
  const ongoingTasks = tasks.filter((task) => task.status === 'Ongoing');
  const doneTasks = tasks.filter((task) => task.status === 'Done');

  return (
    <div className="flex space-x-8 m-4">
      <div className="w-1/3">
        <h2 className="text-indigo-500 text-center font-bold mb-4 text-xl">
          To-do
        </h2>
        {toDoTasks.map(renderTask)}
      </div>
      <div className="w-1/3">
        <h2 className="text-indigo-500 text-center font-bold mb-4 text-xl">
          Ongoing
        </h2>
        {ongoingTasks.map(renderTask)}
      </div>
      <div className="w-1/3">
        <h2 className="text-indigo-500 text-center font-bold mb-4 text-xl">
          Done
        </h2>
        {doneTasks.map(renderTask)}
      </div>
    </div>
  );
};

export { TaskList };
