import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [taskId, setTaskId] = useState('');

  const handleSearch = () => {
    if (taskId) {
      onSearch(taskId);
    }
  };

  return (
    <div className="flex justify-center mb-4">
      <input
        type="number"
        placeholder="Enter Task ID"
        value={taskId}
        onChange={(e) => setTaskId(e.target.value)}
        className="p-2 border rounded"
      />
      <button onClick={handleSearch} className="ml-2 p-2 bg-blue-500 text-white rounded">
        Search
      </button>
    </div>
  );
};

export { SearchBar };
