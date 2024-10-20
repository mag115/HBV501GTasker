package hi.is.tasker.controllers;

import hi.is.tasker.entities.Task;
import hi.is.tasker.services.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import hi.is.tasker.entities.User;
import hi.is.tasker.services.UserService;
import hi.is.tasker.services.NotificationService;
import org.springframework.http.HttpStatus;


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

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Task task = taskService.findById(id);
        return new ResponseEntity<>(task, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        task.setAssignedUser(null); // assignedUser is initially null
        Task savedTask = taskService.save(task);
        return ResponseEntity.ok(savedTask);
    }

    @PostMapping("/{taskId}/assign")
    public ResponseEntity<Task> assignTask(@PathVariable Long taskId, @RequestBody Long userId) {
        Task assignedTask = taskService.assignTask(taskId, userId);
        return ResponseEntity.ok(assignedTask);
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable Long taskId, @RequestBody String status) {
        Task updatedTask = taskService.updateTaskStatus(taskId, status);
        return ResponseEntity.ok(updatedTask);
    }

    @PatchMapping("/{taskId}/priority")
    public ResponseEntity<Task> updateTaskPriority(@PathVariable Long taskId, @RequestBody String priority) {
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
    public ResponseEntity<Void> sendTaskDeadlineReminder(@PathVariable Long taskId) {
        // Fetch task details based on the provided taskId
        Optional<Task> taskOptional = Optional.ofNullable(taskService.findById(taskId));

        if (taskOptional.isEmpty()) {
            // If no task is found, return a 404 response
            return ResponseEntity.notFound().build();
        }

        Task task = taskOptional.get();
        String message = "Reminder: The deadline for task '" + task.getTitle() + "' is approaching. It is on " + task.getDeadline();

        // Assuming you want to notify all users (or adjust logic as needed)
        List<User> allUsers = userService.getAllUsers();

        for (User user : allUsers) {
            notificationService.createNotification(message, user);
        }

        return ResponseEntity.ok().build();
    }

}

