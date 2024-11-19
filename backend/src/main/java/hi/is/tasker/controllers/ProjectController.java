package hi.is.tasker.controllers;

import hi.is.tasker.entities.Project;
import hi.is.tasker.entities.User;
import hi.is.tasker.services.ProjectService;
import hi.is.tasker.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
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

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Project project = projectService.getProjectById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return ResponseEntity.ok(project);
    }

    @PostMapping("/set-current")
    public ResponseEntity<Void> setCurrentProject(@RequestBody Map<String, Long> requestBody, Principal principal) {
        Long projectId = requestBody.get("projectId");

        Project project = projectService.getProjectById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        String username = principal.getName();
        User user = userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the user is a member of the project
        if (!project.getMembers().contains(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        user.setCurrentProject(project);
        userService.save(user);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/current")
    public ResponseEntity<Project> getCurrentProject(Principal principal) {
        String username = principal.getName();
        User user = userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project currentProject = user.getCurrentProject();

        if (currentProject == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        return ResponseEntity.ok(currentProject);
    }
}
