package hi.is.tasker.controllers;

import hi.is.tasker.dto.TaskDto;
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
import java.util.stream.Collectors;

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
    public ResponseEntity<List<TaskDto>> getAllTasksDto() {
        List<Task> tasks = taskService.findAll();
        List<TaskDto> taskDtos = tasks.stream()
                .map(taskService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(taskDtos);
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<TaskDto>> getTasksAssignedToUser(Principal principal) {
        String username = principal.getName();
        List<Task> tasks = taskService.getTasksAssignedToUser(username);
        List<TaskDto> taskDtos = tasks.stream()
                .map(taskService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(taskDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable Long id) {
        Task task = taskService.findById(id);
        TaskDto taskDTO = taskService.convertToDTO(task);
        return new ResponseEntity<>(taskDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<TaskDto> createTask(@RequestBody TaskDto taskDto) {
        Task task = taskService.convertToEntity(taskDto);

        // Handle assigned user if present
        if (taskDto.getAssignedUserId() != null) {
            User assignedUser = userService.getUserById(taskDto.getAssignedUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            task.setAssignedUser(assignedUser);
        }

        task.setStatus("To-do");
        task.updateProgressStatus();
        Task savedTask = taskService.save(task);
        TaskDto savedTaskDto = taskService.convertToDTO(savedTask);
        return ResponseEntity.ok(savedTaskDto);
    }


    @PostMapping("/{taskId}/assign")
    public ResponseEntity<TaskDto> assignTask(@PathVariable Long taskId, @RequestBody Long userId) {
        Task assignedTask = taskService.assignTask(taskId, userId);
        TaskDto assignedTaskDto = taskService.convertToDTO(assignedTask);
        return ResponseEntity.ok(assignedTaskDto);
    }


    @PatchMapping("/{taskId}/status")
    public ResponseEntity<TaskDto> updateTaskStatus(@PathVariable Long taskId, @RequestBody Map<String, String> requestBody) {
        String status = requestBody.get("status");
        Task updatedTask = taskService.updateTaskStatus(taskId, status);
        TaskDto updatedTaskDto = taskService.convertToDTO(updatedTask);
        return ResponseEntity.ok(updatedTaskDto);
    }


    @PatchMapping("/{taskId}/priority")
    public ResponseEntity<TaskDto> updateTaskPriority(@PathVariable Long taskId, @RequestBody Map<String, String> requestBody) {
        String priority = requestBody.get("priority");
        Task updatedTask = taskService.updateTaskPriority(taskId, priority);
        TaskDto updatedTaskDto = taskService.convertToDTO(updatedTask);
        return ResponseEntity.ok(updatedTaskDto);
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
    public ResponseEntity<TaskDto> updateTaskTime(@RequestBody Map<String, Object> request) {
        Long taskId = ((Number) request.get("taskId")).longValue();
        Double timeSpent = ((Number) request.get("timeSpent")).doubleValue();
        Task task = taskService.updateTimeSpent(taskId, timeSpent);

        // Update progress
        taskService.calculateAndUpdateTaskProgress(task);

        TaskDto taskDto = taskService.convertToDTO(task);
        return ResponseEntity.ok(taskDto);
    }


    @PostMapping("/{taskId}/duration")
    public ResponseEntity<TaskDto> assignTaskDuration(
            @PathVariable Long taskId,
            @RequestBody Map<String, Object> requestBody
    ) {
        Integer estimatedWeeks = (Integer) requestBody.get("estimatedWeeks");
        Double effortPercentage = (Double) requestBody.get("effortPercentage");
        Task updatedTask = taskService.assignDuration(taskId, estimatedWeeks, effortPercentage);
        TaskDto updatedTaskDto = taskService.convertToDTO(updatedTask);
        return ResponseEntity.ok(updatedTaskDto);
    }


    @GetMapping("/{taskId}/tracking")
    public ResponseEntity<TaskDto> getTaskProgress(@PathVariable Long taskId) {
        Task task = taskService.findById(taskId);
        taskService.calculateAndUpdateTaskProgress(task);
        TaskDto taskDto = taskService.convertToDTO(task);
        return ResponseEntity.ok(taskDto);
    }


    @PatchMapping("/{taskId}/progress")
    public ResponseEntity<TaskDto> updateTaskProgress(
            @PathVariable Long taskId,
            @RequestBody Map<String, Double> requestBody
    ) {
        Double manualProgress = requestBody.get("manualProgress");
        if (manualProgress == null || manualProgress < 0 || manualProgress > 100) {
            return ResponseEntity.badRequest().build();
        }
        Task task = taskService.updateTaskProgress(taskId, manualProgress);
        TaskDto taskDto = taskService.convertToDTO(task);
        return ResponseEntity.ok(taskDto);
    }


    @GetMapping("/upcoming")
    public ResponseEntity<List<TaskDto>> getUpcomingTasks(@RequestParam("days") int days) {
        List<Task> tasks = taskService.findTasksWithUpcomingDeadlines(days);
        List<TaskDto> taskDtos = tasks.stream()
                .map(taskService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(taskDtos);
    }

}
