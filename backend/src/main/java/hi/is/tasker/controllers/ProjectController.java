package hi.is.tasker.controllers;

import hi.is.tasker.dto.ProjectDto;
import hi.is.tasker.entities.Project;
import hi.is.tasker.entities.User;
import hi.is.tasker.services.ProjectService;
import hi.is.tasker.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.security.Principal;
import java.util.Optional;

@Controller
@RequestMapping("/projects")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public Project createProject(@RequestBody ProjectDto projectDTO, Principal principal) {
        // Get the currently authenticated user
        String username = principal.getName();
        Optional<User> ownerOptional = userService.getUserByUsername(username);

        // Handle the case where the user is not found
        User owner = ownerOptional.orElseThrow(() -> new RuntimeException("User not found"));

        // Call the service to create the project
        return projectService.createProject(projectDTO, owner);
    }
}
