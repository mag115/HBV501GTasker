import React from 'react';
import { Page } from '../components/page';

const Home = () => {
  return (
    <Page>
      <div className="container mx-auto px-4 mt-8 text-center">
        <section className="mb-12">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Welcome to Tasker App
          </h1>
          <p className="text-lg text-slate-300">
            Manage your tasks efficiently and collaborate with your team.
          </p>
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
              <span className="inline-block bg-slate-200 rounded-full px-3 py-1 text-sm font-semibold text-slate-700 mr-2 mb-2">
                #work
              </span>
              <span className="inline-block bg-slate-200 rounded-full px-3 py-1 text-sm font-semibold text-slate-700 mr-2 mb-2">
                #priority
              </span>
              <span className="inline-block bg-slate-200 rounded-full px-3 py-1 text-sm font-semibold text-slate-700 mr-2 mb-2">
                #deadline
              </span>
            </div>
          </div>

          <div className="max-w-lg">
            <p className="mt-4 text-slate-200 text-lg">
              Tasker helps you organize and track all your tasks
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