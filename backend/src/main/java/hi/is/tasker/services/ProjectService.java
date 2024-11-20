package hi.is.tasker.services;

import hi.is.tasker.entities.Project;
import hi.is.tasker.entities.User;

import java.util.List;
import java.util.Optional;

public interface ProjectService {
    Project createProject(Project project, User owner);

    List<Project> getAllProjects();

    Optional<Project> getProjectById(Long id);

    void addMemberToProject(Long projectId, Long userId);

    List<Project> getProjectsForUser(User user);

}
