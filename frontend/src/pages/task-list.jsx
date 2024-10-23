import React, { useState } from 'react';
import { TaskList } from '../components/task-list';
import { Page } from '../components/page';
import { SearchBar } from '../components/search-bar';
import { TaskDialog } from '../components/task-dialog';
import { request } from '../api/http';


const TaskListPage = () => {
  const [task, setTask] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  return (
    <Page>
      <h1 className="text-3xl text-center font-bold text-white mb-8 mt-4 ">
        List of tasks
      </h1>
      <SearchBar onSearch={fetchTaskById} />
      <TaskList />

      {/* Dialog to display task details */}
      <TaskDialog isOpen={isDialogOpen} onClose={closeDialog} task={task} />
    </Page>
  );
};

export { TaskListPage };
