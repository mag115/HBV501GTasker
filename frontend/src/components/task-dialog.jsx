import React from 'react';

const TaskDialog = ({ isOpen, onClose, task }) => {
  // Early return if the modal is not open or task is not provided
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <h2 className="text-xl font-bold mb-4">Task Details</h2>

        <p><strong>ID:</strong> {task.id || 'N/A'}</p>
        <p><strong>Title:</strong> {task.title || 'N/A'}</p>
        <p><strong>Description:</strong> {task.description || 'N/A'}</p>
        <p><strong>Priority:</strong> {task.priority || 'N/A'}</p>
        <p><strong>Status:</strong> {task.status || 'N/A'}</p>
        <p><strong>Deadline:</strong> {task.deadline ? new Date(task.deadline).toLocaleString() : 'No deadline set'}</p>

        <button
          onClick={onClose}
          style={{
            backgroundColor: 'black',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export { TaskDialog };
