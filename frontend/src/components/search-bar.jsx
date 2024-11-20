import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [taskId, setTaskId] = useState('');

  const handleSearch = () => {
    if (taskId) {
      onSearch(taskId);
    }
  };

  return (
    <div className="flex justify-center items-center mb-6">
      <input
        type="number"
        placeholder="Enter Task ID"
        value={taskId}
        onChange={(e) => setTaskId(e.target.value)}
        className="w-60 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={handleSearch}
        className="p-3 bg-indigo-500 text-white rounded-r-lg hover:bg-indigo-600 transition duration-200 ease-in-out"
      >
        Search
      </button>
    </div>
  );
};

export { SearchBar };

