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
      <SearchBar onSearch={fetchTaskById} />
      {/* Show the time frame input and button only to project managers */}
      {auth.role === 'PROJECT_MANAGER' && (
        <div className="text-center mb-6">
            <input
                type="number"
                placeholder="Enter number of days"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="px-3 py-2 border rounded mr-2"
                min="1"
            />
            <button
                onClick={fetchUpcomingTasks}
                lassName="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
            Search Upcoming Tasks
            </button>
        </div>
      )}

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
