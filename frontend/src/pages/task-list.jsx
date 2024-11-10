import React, { useState } from 'react';
import { TaskList } from '../components/task-list';
import { Page } from '../components/page';
import { SearchBar } from '../components/search-bar';
import { TaskDialog } from '../components/task-dialog';
import { UpcomingTasksDialog } from '../components/upcoming-tasks-dialog'; // Updated import
import { request } from '../api/http';
import { useAuth } from '../context/auth-context';


const TaskListPage = () => {
  const [task, setTask] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [days, setDays] = useState('');
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [isUpcomingDialogOpen, setIsUpcomingDialogOpen] = useState(false);

  const { auth } = useAuth();

const fetchTaskById = async (id) => {
  try {
    const response = await request('get', `/tasks/${id}`); // Using the request function
    console.log('Fetched task data:', response.data);
    setTask(response.data);
    setIsDialogOpen(true);
  } catch (error) {
    console.error('Error fetching task:', error);
    alert('Task not found or an error occurred while fetching the task');
    setTask(null);
  }
};

  const closeDialog = () => {
    setIsDialogOpen(false);
    setTask(null); // Clear task when closing the modal
  };

    // Function to fetch upcoming tasks
  const fetchUpcomingTasks = async () => {
    if (!days || days <= 0) {
        alert('Please enter a valid number of days.');
        return;
    }
    try {
        const response = await request('get', `/tasks/upcoming?days=${days}`);
        setUpcomingTasks(response.data);
        setIsUpcomingDialogOpen(true);
    } catch (error) {
        console.error('Error fetching upcoming tasks:', error);
        alert('Failed to fetch upcoming tasks.');
    }
  };

  const closeUpcomingDialog = () => {
    setIsUpcomingDialogOpen(false);
    setUpcomingTasks([]);
  };

  return (
    <Page>
      <h1 className="text-3xl text-center font-bold text-white mb-8 mt-4 ">
        List of tasks
      </h1>

      {/* Combined search section with identical look */}
            <div className="flex flex-col md:flex-row justify-center items-center space-x-0 md:space-x-6 mb-6 w-full">
              {/* Search by ID */}
              <SearchBar onSearch={fetchTaskById} className="flex-grow" />

              {/* Upcoming tasks search (only for Project Managers) */}
              {auth.role === 'PROJECT_MANAGER' && (
                <div className="flex justify-center items-center mb-6">
                  <input
                    type="number"
                    placeholder="Days ahead"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="w-60 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={fetchUpcomingTasks}
                    className="p-3 bg-indigo-500 text-white rounded-r-lg hover:bg-indigo-600 transition duration-200 ease-in-out"
                  >
                    Search Upcoming
                  </button>
                </div>
              )}
            </div>

      <TaskList />

      {/* Dialog to display upcoming tasks */}
        {isUpcomingDialogOpen && (
            <UpcomingTasksDialog
                isOpen={isUpcomingDialogOpen}
                onClose={closeUpcomingDialog}
                tasks={upcomingTasks}
                title={`Tasks with deadlines in the next ${days} days`}
            />
        )}

      {/* Dialog to display task details */}
      <TaskDialog isOpen={isDialogOpen} onClose={closeDialog} task={task} />
    </Page>
  );
};

export { TaskListPage };
