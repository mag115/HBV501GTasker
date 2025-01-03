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
        project.setOwner(owner);
        if (!project.getMembers().contains(owner)) {
            project.getMembers().add(owner);
        }

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

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findByIdWithUsers(id);
    }

    @Override
    public void addMemberToProject(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!project.getMembers().contains(user)) {
            project.getMembers().add(user);
            projectRepository.save(project);
        }
    }

    @Override
    public List<Project> getProjectsForUser(User user) {
        return projectRepository.findByMembersContaining(user);
    }
}
