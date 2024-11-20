// context/project-context.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { request } from '../api/http';
import { useAuth } from './auth-context';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchCurrentProject = async () => {
      if (auth?.token) {
        try {
          const response = await request('get', '/projects/current');
          if (response.status === 200) {
            setSelectedProject(response.data.id);
          }
        } catch (error) {
          console.error('Error fetching current project:', error);
        }
      }
    };

    fetchCurrentProject();
  }, [auth]);

  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
