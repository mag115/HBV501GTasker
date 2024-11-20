import React from 'react';

const UpcomingTasksDialog = ({ isOpen, onClose, tasks, title }) => {
  if (!isOpen || !tasks) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {tasks.length === 0 ? (
          <p>No tasks found within the specified time frame.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="mb-4 border-b pb-2">
              <p>
                <strong>ID:</strong> {task.id || 'N/A'}
              </p>
              <p>
                <strong>Title:</strong> {task.title || 'N/A'}
              </p>
              <p>
                <strong>Description:</strong> {task.description || 'N/A'}
              </p>
              <p>
                <strong>Priority:</strong> {task.priority || 'N/A'}
              </p>
              <p>
                <strong>Status:</strong> {task.status || 'N/A'}
              </p>
              <p>
                <strong>Deadline:</strong>{' '}
                {task.deadline
                  ? new Date(task.deadline).toLocaleString()
                  : 'No deadline set'}
              </p>
            </div>
          ))
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export { UpcomingTasksDialog };
