import React from 'react';
import { Header } from '../components/header';
import { Page } from '../components/page';

const Home = () => {
  return (
    <Page>
      <div className="container mx-auto px-4 mt-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">
            Welcome to Tasker App
          </h1>
        </section>

        <section className="flex justify-center items-start space-x-8 mt-8">
          <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Example Task</div>
              <p className="text-gray-700 text-base">
                This is an example of how a task would look. You can manage your
                tasks by adding deadlines, descriptions, and assigning them to
                team members.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #work
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #priority
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #deadline
              </span>
            </div>
          </div>

          <div className="max-w-lg">
            <p className="mt-4 text-white text-lg">
              Task Manager helps you organize and track all your tasks
              efficiently. Whether you're managing personal projects or working
              with a team, our tool simplifies the process.
            </p>
          </div>
        </section>
      </div>
    </Page>
  );
};

export { Home };
