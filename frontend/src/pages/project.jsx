import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { request } from '../api/http';
import { Page } from '../components/page'; // Import the Page component

const ProjectPage = () => {
  const { id } = useParams(); // Get the project ID from the URL
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await request('get', `/projects/${id}`);
        setProject(response.data);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [id]);

  if (!project) {
    return (
      <Page>
        <div>Loading project details...</div>
      </Page>
    );
  }

  return (
      <Page>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
          <p>{project.description}</p>
          <h2 className="text-xl font-bold mt-6 mb-2">Users with Access</h2>
          {project.members && project.members.length > 0 ? (
            <ul className="list-disc ml-6">
              {project.members.map((user) => (
                <li key={user.id}>{user.username}</li>
              ))}
            </ul>
          ) : (
            <p>No users have access to this project.</p>
          )}
        </div>
      </Page>
    );
  };

export { ProjectPage };
