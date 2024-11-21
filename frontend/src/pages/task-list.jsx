import React, { useState, useEffect } from 'react';
import { TaskList } from '../components/task-list';
import { Page } from '../components/page';
import { SearchBar } from '../components/search-bar';
import { TaskDialog } from '../components/task-dialog';
import { UpcomingTasksDialog } from '../components/upcoming-tasks-dialog'; // Updated import
import { request } from '../api/http';
import { useAuth } from '../context/auth-context';
import { useProject } from '../context/project-context';
import { useNavigate } from 'react-router-dom';

const TaskListPage = () => {
  const [task, setTask] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [days, setDays] = useState('');
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [isUpcomingDialogOpen, setIsUpcomingDialogOpen] = useState(false);
  const { selectedProject } = useProject();
  const [assignedUser, setAssignedUser] = useState('');
  const [isTaskCreated, setIsTaskCreated] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [timeSpent, setTimeSpent] = useState('');
  const [estimatedWeeks, setEstimatedWeeks] = useState('');
  const [effortPercentage, setEffortPercentage] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(null);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [dependency, setDependency] = useState('');
  const [maxWeeks, setMaxWeeks] = useState(0);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState(selectedProject || '');
  const [loading, setLoading] = useState(true);
  const [myTasks, setMyTasks] = useState([]);
  const [error, setError] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    refreshTaskData();
  }, [selectedProject]);

  const refreshTaskData = async () => {
    if (!selectedProject) {
      setMyTasks([]);
      setTasks([]);
      setUpcomingTasks([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await request(
        'get',
        `/tasks/assigned?projectId=${selectedProject}`
      );
      const allTasksResponse = await request(
        'get',
        `/tasks?projectId=${selectedProject}`
      );
      setMyTasks(response.data);
      setTasks(allTasksResponse.data);
    } catch (error) {
      setError('Failed to refresh tasks.');
    } finally {
      setLoading(false);
    }
  };
  const fetchTaskById = async (id) => {
    try {
      const response = await request('get', `/tasks/${id}`);
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
      console.log('öll upcoming', response.data);
      const filteredTasks = response.data.filter((task) => !task.isDeleted); // Adjust based on your task structure
      console.log(filteredTasks);
      setUpcomingTasks(filteredTasks);
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
