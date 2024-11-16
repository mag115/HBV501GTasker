package hi.is.tasker.services;

import hi.is.tasker.dto.ProjectDto;
import hi.is.tasker.entities.Project;
import hi.is.tasker.entities.User;

import java.util.List;
import java.util.Optional;

public interface ProjectService {
    Project createProject(ProjectDto projectDTO, User owner);

    List<ProjectDto> getAllProjects();

    Optional<Project> getProjectById(Long id);
}
