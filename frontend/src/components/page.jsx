import React from 'react';
import { Header } from './header';

const Page = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Header />
      {children}
    </div>
  );
};

export { Page };
