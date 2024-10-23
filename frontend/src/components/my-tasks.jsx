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
          // Stop tracking
          clearInterval(task.timerId);
          task.isTracking = false;
          task.timeSpent += task.elapsedTime;
          task.elapsedTime = 0; // Reset elapsed time

          updateTimeSpent(task.id, task.timeSpent);
        } else {
          // Start tracking
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

  // Render loading state
  if (loading) {
    return <p>Loading tasks...</p>;
  }


  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl text-white font-bold mb-6">My Tasks</h1>


      {myTasks.length > 0 ? (
        myTasks.map((task) => (
          <div key={task.id} className="bg-white p-4 shadow-md rounded-lg mb-4">
            <h2 className="text-xl font-bold">{task.title}</h2>
            <p>Description: {task.description}</p>
            <p>Priority: {task.priority}</p>
            <p>Status: {task.status}</p>
            <p>Deadline: {new Date(task.deadline).toLocaleString()}</p>

            {/* Timer Display */}
            <div>
              <p>
                Time Spent: {formatTime(task.isTracking ? task.elapsedTime + task.timeSpent : task.timeSpent)}
              </p>
              <button
                className="bg-black text-white px-4 py-2 rounded-md w-full hover:bg-blue-600"
                onClick={() => handleTimer(task.id)}
              >
                {task.isTracking ? 'Stop Tracking' : 'Start Tracking'}
              </button>
            </div>

            {/* Manual time input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1 mt-4">Manual time</label>
              <input
                onKeyDown={(e) => handleManualTimeChange(task.id, e.target.value, e)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                type="text"
                placeholder="Enter time and press Enter"
              />
            </div>
          </div>
        ))
      ) : (
        <p>No tasks assigned to you.</p>
      )}
    </div>
  );
};

export { MyTasks };
