package hi.is.tasker.services;

import hi.is.tasker.entities.Project;
import hi.is.tasker.entities.User;
import hi.is.tasker.repositories.ProjectRepository;
import hi.is.tasker.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImplementation implements ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public Project createProject(Project project, User owner) {
        // Log statements
        System.out.println("Creating project with name: " + project.getName());
        System.out.println("Owner: " + owner.getUsername());

        // Set the owner and add the owner to members
        project.setOwner(owner);
        if (!project.getMembers().contains(owner)) {
            project.getMembers().add(owner);
        }

        // Add selected users to the project if they aren't already members
        if (project.getMembers() != null && !project.getMembers().isEmpty()) {
            List<Long> memberIds = project.getMembers().stream()
                    .map(User::getId)
                    .collect(Collectors.toList());
            List<User> users = userRepository.findAllById(memberIds);
            project.setMembers(users);
        }

        return projectRepository.save(project);
    }

    @Transactional(readOnly = true)
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // New method to retrieve a project by ID
    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }
}
