package hi.is.tasker.services;

import hi.is.tasker.dto.ProjectDto;
import hi.is.tasker.entities.Project;
import hi.is.tasker.entities.User;
import hi.is.tasker.repositories.ProjectRepository;
import hi.is.tasker.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImplementation implements ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public Project createProject(ProjectDto projectDTO, User owner) {
        if (projectDTO == null) {
            throw new IllegalArgumentException("ProjectDTO is null");
        }
        if (owner == null) {
            throw new IllegalArgumentException("Owner is null");
        }

        // Log statements
        System.out.println("Creating project with name: " + projectDTO.getName());
        System.out.println("Owner: " + owner.getUsername());


        Project project = new Project();
        project.setName(projectDTO.getName());
        project.setDescription(projectDTO.getDescription());
        project.setOwner(owner);
        project.getMembers().add(owner);

        // Add selected users to the project
        if (projectDTO.getUserIds() != null && !projectDTO.getUserIds().isEmpty()) {
            List<User> users = userRepository.findAllById(projectDTO.getUserIds());
            project.getMembers().addAll(users);
        }

        return projectRepository.save(project);
    }
}
