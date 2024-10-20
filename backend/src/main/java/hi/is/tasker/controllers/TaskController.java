package hi.is.tasker.controllers;

import hi.is.tasker.entities.Task;
import hi.is.tasker.services.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
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
}

