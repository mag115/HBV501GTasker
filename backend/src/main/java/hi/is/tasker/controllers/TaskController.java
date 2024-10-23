package hi.is.tasker.controllers;

import hi.is.tasker.entities.Task;
import hi.is.tasker.entities.User;
import hi.is.tasker.services.NotificationService;
import hi.is.tasker.services.TaskService;
import hi.is.tasker.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;
    private final UserService userService;
    private final NotificationService notificationService;

    public TaskController(TaskService taskService, UserService userService, NotificationService notificationService) {
        this.taskService = taskService;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.findAll();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<Task>> getTasksAssignedToUser(Principal principal) {
        String username = principal.getName();
        List<Task> tasks = taskService.getTasksAssignedToUser(username);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Task task = taskService.findById(id);
        return new ResponseEntity<>(task, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task, @RequestParam(required = false) Long assignedUserId) {
        if (assignedUserId != null) {
            User assignedUser = userService.getUserById(assignedUserId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            task.setAssignedUser(assignedUser);
        }
        task.setStatus("To-do");
        Task savedTask = taskService.save(task);
        return ResponseEntity.ok(savedTask);
    }

    @PostMapping("/{taskId}/assign")
    public ResponseEntity<Task> assignTask(@PathVariable Long taskId, @RequestBody Long userId) {
        Task assignedTask = taskService.assignTask(taskId, userId);

        // Fetch the assigned user and create a notification
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String message = "You were assigned a new task: '" + assignedTask.getTitle() + "'";

        notificationService.createNotification(message, user);

        return ResponseEntity.ok(assignedTask);
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable Long taskId, @RequestBody Map<String, String> requestBody) {
        String status = requestBody.get("status");
        Task updatedTask = taskService.updateTaskStatus(taskId, status);
        return ResponseEntity.ok(updatedTask);
    }

    @PatchMapping("/{taskId}/priority")
    public ResponseEntity<Task> updateTaskPriority(@PathVariable Long taskId, @RequestBody Map<String, String> requestBody) {
        String priority = requestBody.get("priority");
        Task updatedTask = taskService.updateTaskPriority(taskId, priority);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        Task task = taskService.findById(id);
        taskService.delete(task);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{taskId}/reminder")
    public ResponseEntity<String> sendTaskDeadlineReminder(@PathVariable Long taskId) {
        // Fetch task details based on the provided taskId
        Optional<Task> taskOptional = Optional.ofNullable(taskService.findById(taskId));

        if (taskOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Task task = taskOptional.get();
        User assignedUser = task.getAssignedUser();

        if (assignedUser != null) {
            String message = "Reminder: The deadline for task '" + task.getTitle() + "' is approaching. It is on " + task.getDeadline();
            notificationService.createNotification(message, assignedUser);
            return ResponseEntity.ok("Reminder sent to user.");
        }

        return ResponseEntity.badRequest().body("No user assigned to this task.");
    }

    @PostMapping("/updateTime")
    public ResponseEntity<Task> updateTaskTime(@RequestBody Map<String, Object> request) {
        Long taskId = ((Number) request.get("taskId")).longValue();
        Double timeSpent = ((Number) request.get("timeSpent")).doubleValue();

        Task task = taskService.updateTimeSpent(taskId, timeSpent);
        return ResponseEntity.ok(task);
    }
}
