package hi.is.tasker.controllers;

import hi.is.tasker.entities.Task;
import hi.is.tasker.repositories.TaskRepository;
import hi.is.tasker.services.TaskService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import java.util.List;

@RestController
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/tasks")
    public List<Task> getAllTasks() {
        return taskService.findAll();
    }

    @GetMapping("/tasks/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.findById(id);
    }

    @PostMapping("/tasks")
    public Task createTask(@Valid @RequestBody Task task) {
        return taskService.save(task);
    }

    @PostMapping("/tasks/{taskId}/assign")    //bætti þessu við
    public Task assignTask(@PathVariable Long taskId, @RequestBody Long userId) {
        return taskService.assignTask(taskId, userId);
    }

    @PatchMapping("/tasks/{taskId}/status") //bætti þessu við
    public Task updateTaskStatus(@PathVariable Long taskId, @RequestBody String status) {
        return taskService.updateTaskStatus(taskId, status);
    }

    @PatchMapping("/tasks/{taskId}/priority") //bætti þessu við
    public Task updateTaskPriority(@PathVariable Long taskId, @RequestBody String priority) {
        return taskService.updateTaskPriority(taskId, priority);
    }
    @DeleteMapping("/tasks/{id}")
    public void deleteTask(@PathVariable Long id) {
        Task task = taskService.findById(id);
        taskService.delete(task);
    }
}
