import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/auth-context';
import { request } from '../api/http';

const MyInfo = () => {
  const { auth } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [filteredTask, setFilteredTask] = useState(null);

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        const response = await request('get', `/tasks?assignedTo=${auth.user.id}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    if (auth.user) {
      fetchAssignedTasks();
    }
  }, [auth.user]);

  const handleSearchById = async () => {
    if (!searchId) return;

    try {
      const response = await request('get', `/tasks/${searchId}`);
      setFilteredTask(response.data);
    } catch (error) {
      console.error('Error fetching task by ID:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Tasks Assigned to You</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Task ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleSearchById}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Search
        </button>
      </div>

      {filteredTask ? (
        <div className="bg-white p-4 shadow-md rounded-lg mb-4">
          <h2 className="text-xl font-bold text-white">Task: {filteredTask.title}</h2>
          <p className="text-white">{filteredTask.description}</p>
        </div>
      ) : (
        <>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.id} className="bg-white p-4 shadow-md rounded-lg mb-4">
                <h2 className="text-xl font-bold text-white">{task.title}</h2>
                <p className="text-white">{task.description}</p>
              </div>
            ))
          ) : (
            <p className="text-white">No tasks assigned to you yet.</p>
          )}
        </>
      )}
    </div>
  );
};

export { MyInfo };
