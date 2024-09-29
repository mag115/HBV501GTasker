import React from 'react';
import { Header } from './header';

const Page = ({ children }) => {
  return (
    <div className="bg-black flex-1 h-full">
      <Header />
      {children}
    </div>
  );
};

export { Page };
