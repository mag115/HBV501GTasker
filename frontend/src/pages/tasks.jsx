import React from 'react';
import { TaskForm } from '../components/task-form';
import { TaskList } from '../components/task-list';
import { Page } from '../components/page';

const Tasks = () => {
  return (
    <Page>
      <TaskList />
    </Page>
  );
};
export { Tasks };
