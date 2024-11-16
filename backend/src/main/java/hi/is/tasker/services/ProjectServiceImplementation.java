package hi.is.tasker.services;

import hi.is.tasker.dto.ProjectDto;
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

    public Project createProject(ProjectDto projectDTO, User owner) {
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

    @Transactional(readOnly = true)
    public List<ProjectDto> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        return projects.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // New method to retrieve a project by ID
    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    private ProjectDto convertToDTO(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        // Map other necessary fields
        return dto;
    }
}
