import React, { useEffect, useState } from 'react';
import { request } from '../api/http';
import { useProject } from '../context/project-context';

const MyTasks = () => {
  const { selectedProject } = useProject();
  const [myTasks, setMyTasks] = useState([]);
  const [tasks, setTasks] = useState([]); // For dependency check
  const [manualProgress, setManualProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
   refreshTaskData();
 }, [selectedProject]);

 const refreshTaskData = async () => {
   if (!selectedProject) {
     setMyTasks([]);
     setTasks([]);
     setLoading(false);
     return;
   }
   try {
     setLoading(true);
     const response = await request('get', `/tasks/assigned?projectId=${selectedProject}`);
     const allTasksResponse = await request('get', `/tasks?projectId=${selectedProject}`);
     setMyTasks(response.data);
     setTasks(allTasksResponse.data);
   } catch (error) {
     setError('Failed to refresh tasks.');
   } finally {
     setLoading(false);
   }
 };

  const handleManualTimeChange = (taskId, value, event) => {
    if (event.key === 'Enter') {
      const updatedTasks = myTasks.map((task) => {
        if (task.id === taskId) {
          const parsedValue = parseInt(value, 10);
          if (!isNaN(parsedValue)) {
            task.timeSpent += parsedValue;
            task.elapsedTime = 0;
            const calculatedProgress = Math.min((task.timeSpent / (task.estimatedDuration * 3600)) * 100, 100);
            task.progress = Math.round(calculatedProgress);
            updateTimeSpent(task.id, task.timeSpent).then(refreshTaskData);
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

        const calculatedProgress = Math.min((task.timeSpent / (task.estimatedDuration * 3600)) * 100, 100);
        task.progress = Math.round(calculatedProgress);

          updateTimeSpent(task.id, task.timeSpent).then(refreshTaskData);
        }
        else {
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
        taskId,
        timeSpent
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
      await request('patch', `/tasks/${taskId}/status`, { status: newStatus, });
      await refreshTaskData();
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

  const canStartTimer = (task) => {
    if (!task.dependency) return true;
    const depTask = tasks.find((t) => t.id === task.dependency);
    console.log("task sem er deletað", depTask);
    console.log("taskið", task);
    return depTask=== undefined || depTask.status === 'Done';
  };

const handleProgressChange = async (taskId, value) => {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 100) {
        alert('Please enter a valid progress percentage between 0 and 100.');
        return;
    }
    try {
        // Update only the local state for manualProgress
        setManualProgress((prev) => ({ ...prev, [taskId]: parsedValue }));

        await request('patch', `/tasks/${taskId}/progress`, { manualProgress: parsedValue });

    } catch (error) {
        console.error('Error updating task manual progress:', error);
        alert('Failed to update task progress.');
    }
};

  const toDoTasks = Array.isArray(myTasks) ? myTasks.filter((task) => task.status === 'To-do') : [];
  const ongoingTasks = Array.isArray(myTasks) ? myTasks.filter((task) => task.status === 'Ongoing') : [];
  const doneTasks = Array.isArray(myTasks) ? myTasks.filter((task) => task.status === 'Done') : [];


  const renderTask = (task) => (
    <div key={task.id} className="bg-white p-6 shadow-lg rounded-lg mb-6 border border-gray-200">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-2">{task.title}</h2>
      <p className="text-gray-700 mb-2"><strong>Description:</strong> {task.description}</p>
      <p className={`mb-2 ${getPriorityColor(task.priority)}`}>
        <strong>Priority:</strong> {task.priority}
      </p>


{task.status !== 'Done' && (
  <>
      <label className="text-gray-700 mb-1">Status:</label>
      <select
        className="w-full px-3 py-2 border rounded mb-4"
        value={task.status}
        onChange={(e) => handleStatusChange(task.id, e.target.value)}
        disabled={!canStartTimer(task)}
      >
        <option value="To-do">To-do</option>
        <option value="Ongoing">Ongoing</option>
        <option value="Done">Done</option>
      </select>
</>)}
      <p className="text-gray-700 mb-4"><strong>Deadline:</strong> {new Date(task.deadline).toLocaleString()}</p>

      <div className="mb-4">
        <p className="text-gray-700 mb-2">
          <strong>Time Spent:</strong> {formatTime(task.isTracking ? task.elapsedTime + task.timeSpent  : task.timeSpent)}
        </p>
        {task.status !== 'Done' && (
          <>
        <button
          style={{
            backgroundColor: task.isTracking ? '#DC2626' : '#6366F1',
            color: 'white',
          }}
          className="w-full py-2 rounded-md hover:opacity-90"
          onClick={() => handleTimer(task.id)}
          disabled={!canStartTimer(task)}
        >
          {task.isTracking ? 'Stop Tracking' : 'Start Tracking'}
        </button></>)}
        {!canStartTimer(task) && (
          <p className="text-red-500 mt-2">
            This task cannot start until all dependencies are completed.
          </p>
        )}
      </div>
{task.status !== 'Done' && (
          <>
      <div>
        <label className="block text-sm font-bold text-indigo-500 mb-1 mt-4">Manual time</label>
        <input
          onKeyDown={(e) => handleManualTimeChange(task.id, e.target.value, e)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          type="text"
          placeholder="Enter time in seconds and press Enter"
          disabled={!canStartTimer(task)}
        />
      </div></>)}
{task.status !== 'Done' && (
          <>
      <div className="mt-4">
        <p className="text-gray-700 mb-2">
          <strong>User-Set Progress:</strong> {manualProgress[task.id] !== undefined ? `${Math.round(manualProgress[task.id])}%` : 'Not set'}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Calculated Progress:</strong> {task.progress !== undefined ? `${Math.round(task.progress)}%` : 'N/A'}
        </p>
        <label className="block text-sm font-bold text-indigo-500 mb-1">Set Manual Progress (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          value={manualProgress[task.id] || ''}
          onChange={(e) => setManualProgress((prev) => ({ ...prev, [task.id]: e.target.value }))}
          onKeyDown={(e) => e.key === 'Enter' && handleProgressChange(task.id, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter progress percentage"
        />
      </div></>)}
    </div>
  );



  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-[#1E293B] py-8">
      <h1 className="text-3xl font-bold text-indigo-500 text-center mb-6">My Tasks</h1>
      <div className="flex space-x-8 m-4">
        <div className="w-1/3">
          <h2 className="text-white text-center font-bold mb-4 text-xl">To-do</h2>
          {toDoTasks.length > 0 ? toDoTasks.map(renderTask) : <p className="text-center text-gray-500">No tasks have been assigned to you yet!</p>}
        </div>
        <div className="w-1/3">
          <h2 className="text-white text-center font-bold mb-4 text-xl">Ongoing</h2>
          {ongoingTasks.length > 0 ? ongoingTasks.map(renderTask) : <p className="text-center text-gray-500">No ongoing tasks.</p>}
        </div>
        <div className="w-1/3">
          <h2 className="text-white text-center font-bold mb-4 text-xl">Completed</h2>
          {doneTasks.length > 0 ? doneTasks.map(renderTask) : <p className="text-center text-gray-500">No completed tasks.</p>}
        </div>
      </div>
    </div>
  );
};

export { MyTasks };
