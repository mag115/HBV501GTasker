package hi.is.tasker;

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

    //private final TaskRepository taskRepository;
    private final TaskService taskService;

    /*public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }*/

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/tasks")
    public List<Task> getAllTasks() {
        //return taskRepository.findAll();
        return taskService.findAll();
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.findById(id);
    }

    @PostMapping("/tasks")
    public Task createTask(@RequestBody Task task) {
        //return taskRepository.save(task);
        return taskService.save(task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        Task task = taskService.findById(id);
        taskService.delete(task);
    }

    // TODO: skoða þessi endpoints, bætti þessu við

    @PostMapping("/{taskId}/assign")
    public Task assignTask(@PathVariable Long taskId, @RequestBody Long userId) {
        return taskService.assignTask(taskId, userId);
    }

    @PatchMapping("/{taskId}/status")
    public Task updateTaskStatus(@PathVariable Long taskId, @RequestBody String status) {
        return taskService.updateTaskStatus(taskId, status);
    }

    @PatchMapping("/{taskId}/priority")
    public Task updateTaskPriority(@PathVariable Long taskId, @RequestBody String priority) {
        return taskService.updateTaskPriority(taskId, priority);
    }

    @GetMapping("/filter")
    public List<Task> filterTasksByStatus(@RequestParam String status) {
        return taskService.filterTasksByStatus(status);
    }

    @PostMapping("/{taskId}/reminder")
    public void sendReminder(@PathVariable Long taskId) {
        taskService.sendReminder(taskId);
    }

    @PostMapping("/{taskId}/time/start")
    public void startTaskTimer(@PathVariable Long taskId) {
        taskService.startTaskTimer(taskId);
    }

    @PostMapping("/{taskId}/time/stop")
    public void stopTaskTimer(@PathVariable Long taskId) {
        taskService.stopTaskTimer(taskId);
    }

    @PatchMapping("/{taskId}/time/manual")
    public void manualTimeEntry(@PathVariable Long taskId, @RequestBody double timeSpent) {
        taskService.manualTimeEntry(taskId, timeSpent);
    }

    @GetMapping("/report/{projectId}")
    public String generateProjectReport(@PathVariable Long projectId) {
        return taskService.generateProjectReport(projectId);
    }
}
