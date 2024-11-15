package hi.is.tasker.controllers;

import hi.is.tasker.dto.ProjectDto;
import hi.is.tasker.entities.Project;
import hi.is.tasker.entities.User;
import hi.is.tasker.services.ProjectService;
import hi.is.tasker.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/projects")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @PostMapping
    public Project createProject(@RequestBody ProjectDto projectDTO, Principal principal) {

        if (principal == null) {
            throw new AuthenticationCredentialsNotFoundException("Principal is null");
        }
        // Get the currently authenticated user
        String username = principal.getName();
        Optional<User> ownerOptional = userService.getUserByUsername(username);

        // Handle the case where the user is not found
        User owner = ownerOptional.orElseThrow(() -> new RuntimeException("User not found"));

        // Call the service to create the project
        return projectService.createProject(projectDTO, owner);
    }
}
