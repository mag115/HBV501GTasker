package hi.is.tasker.services;

import hi.is.tasker.dto.ProjectDto;
import hi.is.tasker.entities.Project;
import hi.is.tasker.entities.User;

import java.util.Optional;

public interface ProjectService {
    Project createProject(ProjectDto projectDTO, Optional<User> owner)
}
