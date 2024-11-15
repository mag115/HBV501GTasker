package hi.is.tasker.services;

import hi.is.tasker.dto.ProjectDto;
import hi.is.tasker.entities.Project;
import hi.is.tasker.entities.User;

public interface ProjectService {
    Project createProject(ProjectDto projectDTO, User owner);
}
