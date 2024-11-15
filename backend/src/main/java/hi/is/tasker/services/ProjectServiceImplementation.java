package hi.is.tasker.services;

import hi.is.tasker.dto.ProjectDto;
import hi.is.tasker.entities.Project;
import hi.is.tasker.entities.User;
import hi.is.tasker.repositories.ProjectRepository;
import hi.is.tasker.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectServiceImplementation implements ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public Project createProject(ProjectDto projectDTO, User owner) {
        // Create a new Project entity
        Project project = new Project();
        project.setName(projectDTO.getName());
        project.setDescription(projectDTO.getDescription());
        project.setOwner(owner);
        project.getMembers().add(owner); // Add the owner as a member

        // Save the project to the database
        return projectRepository.save(project);
    }
}
