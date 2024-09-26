package hi.is.tasker.services;

import hi.is.tasker.entities.Task;
import hi.is.tasker.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TaskServiceImplementation implements TaskService {
    private TaskRepository taskRepository;

    @Autowired
    public TaskServiceImplementation(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    @Override
    public Task findById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    @Override
    public Task save(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public void delete(Task task) {
        taskRepository.delete(task);
    }

    //TODO: Þurfum að implementa þessar:

    @Override
    public Task assignTask(Long taskId, Long userId) {
        return null;
    }

    @Override
    public Task updateTaskStatus(Long taskId, String status) {
        return null;
    }

    @Override
    public Task updateTaskPriority(Long taskId, String priority) {
        return null;
    }

    @Override
    public List<Task> filterTasksByStatus(String status) {
        return null;
    }

    @Override
    public void sendReminder(Long taskId) {
    }

    @Override
    public void startTaskTimer(Long taskId) {
    }

    @Override
    public void stopTaskTimer(Long taskId) {
    }

    @Override
    public void manualTimeEntry(Long taskId, double timeSpent) {
    }

    @Override
    public String generateProjectReport(Long projectId) {
        return "Project Report";
    }
}