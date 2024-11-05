import React, { useEffect, useState } from 'react';
import { request } from '../api/http';

const MyTasks = () => {
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleManualTimeChange = (taskId, value, event) => {
    if (event.key === 'Enter') {
      const updatedTasks = myTasks.map((task) => {
        if (task.id === taskId) {
          const parsedValue = parseInt(value, 10); // Parse input as integer (seconds)
          if (!isNaN(parsedValue)) {
            task.timeSpent += parsedValue;
            task.elapsedTime = 0;

            updateTimeSpent(task.id, task.timeSpent);

            event.target.value = '';
          }
        }
        return task;
      });
      setMyTasks(updatedTasks);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTimer = (taskId) => {
    const updatedTasks = myTasks.map((task) => {
      if (task.id === taskId) {
        if (task.isTracking) {
          clearInterval(task.timerId);
          task.isTracking = false;
          task.timeSpent += task.elapsedTime;
          task.elapsedTime = 0;

          updateTimeSpent(task.id, task.timeSpent);
        } else {
          task.isTracking = true;
          task.elapsedTime = 0;
          task.timerId = setInterval(() => {
            task.elapsedTime += 1;
            setMyTasks([...updatedTasks]);
          }, 1000);
        }
      }
      return task;
    });
    setMyTasks(updatedTasks);
  };

  const updateTimeSpent = async (taskId, timeSpent) => {
    try {
      await request('post', '/tasks/updateTime', {
        taskId: taskId,
        timeSpent: timeSpent,
      });
    } catch (error) {
      console.error('Error updating time spent:', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setMyTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      await request('patch', `/tasks/${taskId}/status`, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
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

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const response = await request('get', '/tasks/assigned');
        setMyTasks(response.data);
      } catch (error) {
        console.error('Error fetching my tasks:', error);
        setError('Failed to fetch tasks assigned to you.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyTasks();
  }, []);

  const toDoTasks = myTasks.filter((task) => task.status === 'To-do');
  const ongoingTasks = myTasks.filter((task) => task.status === 'Ongoing');
  const doneTasks = myTasks.filter((task) => task.status === 'Done');

  const renderTask = (task) => (
    <div key={task.id} className="bg-white p-6 shadow-lg rounded-lg mb-6 border border-gray-200">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-2">{task.title}</h2>
      <p className="text-gray-700 mb-2"><strong>Description:</strong> {task.description}</p>
      <p className={`mb-2 ${getPriorityColor(task.priority)}`}>
        <strong>Priority:</strong> {task.priority}
      </p>

      {/* Status Dropdown */}
      <label className="text-gray-700 mb-1">Status:</label>
      <select
        className="w-full px-3 py-2 border rounded mb-4"
        value={task.status}
        onChange={(e) => handleStatusChange(task.id, e.target.value)}
      >
        <option value="To-do">To-do</option>
        <option value="Ongoing">Ongoing</option>
        <option value="Done">Done</option>
      </select>

      <p className="text-gray-700 mb-4"><strong>Deadline:</strong> {new Date(task.deadline).toLocaleString()}</p>

      <div className="mb-4">
        <p className="text-gray-700 mb-2">
          <strong>Time Spent:</strong> {formatTime(task.isTracking ? task.elapsedTime + task.timeSpent : task.timeSpent)}
        </p>
        <button
          style={{
            backgroundColor: task.isTracking ? '#DC2626' : '#6366F1',
            color: 'white',
          }}
          className="w-full py-2 rounded-md hover:opacity-90"
          onClick={() => handleTimer(task.id)}
        >
          {task.isTracking ? 'Stop Tracking' : 'Start Tracking'}
        </button>
      </div>

      <div>
        <label className="block text-sm font-bold text-indigo-500 mb-1 mt-4">Manual time</label>
        <input
          onKeyDown={(e) => handleManualTimeChange(task.id, e.target.value, e)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          type="text"
          placeholder="Enter time in seconds and press Enter"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1E293B] py-8">
      <h1 className="text-3xl font-bold text-indigo-500 text-center mb-6">My Tasks</h1>
      <div className="flex space-x-8 m-4">
        <div className="w-1/3">
          <h2 className="text-white text-center font-bold mb-4 text-xl">To-do</h2>
          {toDoTasks.map(renderTask)}
        </div>
        <div className="w-1/3">
          <h2 className="text-white text-center font-bold mb-4 text-xl">Ongoing</h2>
          {ongoingTasks.map(renderTask)}
        </div>
        <div className="w-1/3">
          <h2 className="text-white text-center font-bold mb-4 text-xl">Completed</h2>
          {doneTasks.map(renderTask)}
        </div>
      </div>
    </div>
  );
};

export { MyTasks };
