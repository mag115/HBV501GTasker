import React from 'react';
import { TaskList } from '../components/task-list';
import { Page } from '../components/page';

const TaskListPage = () => {
  return (
    <Page>
     <h1 className="text-3xl text-center font-bold text-white mb-8 mt-4 ">
       List of tasks
     </h1>
      <TaskList />
    </Page>
  );
};
export { TaskListPage };
