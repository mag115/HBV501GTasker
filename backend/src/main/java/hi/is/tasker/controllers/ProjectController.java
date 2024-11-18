package hi.is.tasker.controllers;

import hi.is.tasker.entities.Project;
import hi.is.tasker.entities.User;
import hi.is.tasker.services.ProjectService;
import hi.is.tasker.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
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
    public Project createProject(@RequestBody Project project, Principal principal) {
        // Get the currently authenticated user
        String username = principal.getName();
        Optional<User> ownerOptional = userService.getUserByUsername(username);

        // Handle the case where the user is not found
        User owner = ownerOptional.orElseThrow(() -> new RuntimeException("User not found"));

        // Call the service to create the project
        return projectService.createProject(project, owner);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'TEAM_MEMBER')")
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    // New GET method to retrieve a project by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'TEAM_MEMBER')")
    public Optional<Project> getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }
}
