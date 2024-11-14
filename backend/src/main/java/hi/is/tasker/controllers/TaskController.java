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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
        for (Task task : tasks) {
            System.out.println("Task ID: " + task.getId() + ", Assigned User: " + (task.getAssignedUser() != null ? task.getAssignedUser().getUsername() : "Unassigned"));
        }
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
        System.out.println("Received assignedUserId: " + assignedUserId);
        if (assignedUserId != null) {
            User assignedUser = userService.getUserById(assignedUserId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            task.setAssignedUser(assignedUser);
            System.out.println("Assigned User set with username: " + assignedUser.getUsername());
        }
        task.setStatus("To-do");
        // task.setProgress(0.0);
        // task.setProgressStatus("Not Started");
        task.updateProgressStatus();
        Task savedTask = taskService.save(task);
        return ResponseEntity.ok(savedTask);
    }


    @PostMapping("/{taskId}/assign")
    public ResponseEntity<Task> assignTask(@PathVariable Long taskId, @RequestBody Long userId) {
        Task assignedTask = taskService.assignTask(taskId, userId);
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
        try {
            taskService.sendReminder(taskId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/updateTime")
    public ResponseEntity<Task> updateTaskTime(@RequestBody Map<String, Object> request) {
        Long taskId = ((Number) request.get("taskId")).longValue();
        Double timeSpent = ((Number) request.get("timeSpent")).doubleValue();
        Task task = taskService.updateTimeSpent(taskId, timeSpent);

        // Update progress
        taskService.calculateAndUpdateTaskProgress(task);

        return ResponseEntity.ok(task);
    }

    // Assign predicted task duration based on either weeks or effort percentage
    @PostMapping("/{taskId}/duration")
    public ResponseEntity<Task> assignTaskDuration(
            @PathVariable Long taskId,
            @RequestBody Map<String, Object> requestBody
    ) {
        Integer estimatedWeeks = (Integer) requestBody.get("estimatedWeeks");
        Double effortPercentage = (Double) requestBody.get("effortPercentage");
        Task updatedTask = taskService.assignDuration(taskId, estimatedWeeks, effortPercentage);
        return ResponseEntity.ok(updatedTask);
    }


    @GetMapping("/{taskId}/tracking")
    public ResponseEntity<Map<String, Object>> getTaskProgress(@PathVariable Long taskId) {
        Task task = taskService.findById(taskId);
        taskService.calculateAndUpdateTaskProgress(task);

        Map<String, Object> response = new HashMap<>();
        response.put("taskId", taskId);
        response.put("title", task.getTitle());
        response.put("progress", task.getProgress());
        response.put("manualProgress", task.getManualProgress());
        response.put("status", task.getProgressStatus());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{taskId}/progress")
    public ResponseEntity<Task> updateTaskProgress(
            @PathVariable Long taskId,
            @RequestBody Map<String, Double> requestBody
    ) {
        Double manualProgress = requestBody.get("manualProgress");
        if (manualProgress == null || manualProgress < 0 || manualProgress > 100) {
            return ResponseEntity.badRequest().build();
        }
        Task task = taskService.findById(taskId);
        task.setManualProgress(manualProgress);
        taskService.save(task);
        return ResponseEntity.ok(task);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Task>> getUpcomingTasks(@RequestParam("days") int days) {
        List<Task> tasks = taskService.findTasksWithUpcomingDeadlines(days);
        return ResponseEntity.ok(tasks);
    }
}
