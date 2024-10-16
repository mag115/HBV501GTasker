import React, { useEffect, useState } from 'react';
import { request } from '../api/http';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'fyrsta',
        deadline: new Date().toISOString(),
        reminderSent: false,
        priority: 'low',
        status: 'To-do',
      },
      {
        id: 2,
        title: 'Task 2',
        description: 'annað',
        deadline: new Date(Date.now() + 86400000).toISOString(),
        reminderSent: true,
        priority: 'medium',
        status:'To-do',
      },
      {
        id: 3,
        title: 'Task 3',
        description: 'þriðja',
        deadline: new Date(Date.now() + 172800000).toISOString(),
        reminderSent: false,
        priority: 'high',
        status:'To-do',
      },
    ];

  {/*useEffect(() => {
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
    };*/}

    useEffect(() => {
        const fetchTasks = async () => {
          try {
            // Uncomment this line when you want to fetch from the API
            // const response = await request('get', '/tasks');
            // setTasks(response.data);

            // Use mock data for testing
            setTasks(mockTasks);
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
   const priorityOptions = ['high', 'medium', 'low'];

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

const geraTask = (task) => (
    <div key={task.id} className="max-w-sm rounded overflow-hidden shadow-lg bg-white mb-4">
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
        <p className="text-black-500">Deadline: {new Date(task.deadline).toLocaleString()}</p>
        <p className="text-black-500">Priority: {task.priority}</p>
      </div>
    </div>
  );

  return (
    <div className="flex space-x-8 m-4">
      {/*To-do*/}
      <div className="w-1/3">
        <h2 className="text-white text-center font-bold mb-4">To-do</h2>
        {toDoTasks.map(geraTask)}
      </div>

      {/*ongoing*/}
      <div className="w-1/3">
        <h2 className="text-white text-center font-bold mb-4">Ongoing</h2>
        {ongoingTasks.map(geraTask)}
      </div>

      {/* Done Column */}
      <div className="w-1/3">
        <h2 className="text-white text-center font-bold mb-4">Done</h2>
        {doneTasks.map(geraTask)}
      </div>
    </div>
  );
};









    {/*<div>
      <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
      <ul className="list-disc pl-5">
        {tasks.map((task) => (
          <li key={task.id} className="mb-2">
            <h3 className="text-gray-500">{task.title}</h3>
            <p className="text-gray-500">{task.status}</p>
            <p className="text-gray-500">
            {task.description}</p>
            <p className="text-gray-500">
              Deadline: {new Date(task.deadline).toLocaleString()}
            </p>
            <p className="text-gray-500">
            Priority: {task.priority}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};*/}


export { TaskList };
