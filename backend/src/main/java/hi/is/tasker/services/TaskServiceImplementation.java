package hi.is.tasker.services;

import hi.is.tasker.entities.Task;
import hi.is.tasker.entities.User;
import hi.is.tasker.repositories.TaskRepository;
import hi.is.tasker.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class TaskServiceImplementation implements TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Autowired
    public TaskServiceImplementation(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }


    @Override
    public List<Task> findAll() {
        return taskRepository.findAll();  // returns a List<Task>
    }

    @Override
    public List<Task> getTasksAssignedToUser(String username) {
        return taskRepository.findByAssignedUserUsername(username);
    }

    @Override
    public Task findById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    @Override
    public Task save(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public Task updateTimeSpent(Long taskId, double timeSpent) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        task.setTimeSpent(task.getTimeSpent() + timeSpent);
        return taskRepository.save(task);
    }

    @Override
    public void delete(Task task) {
        taskRepository.delete(task);
    }

    @Override
    public Task assignTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        task.setAssignedUser(user);
        return taskRepository.save(task);
    }

    @Override
    public Task updateTaskStatus(Long taskId, String status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        task.setStatus(status);
        return taskRepository.save(task);
    }

    @Override
    public Task updateTaskPriority(Long taskId, String priority) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        task.setPriority(priority);
        return taskRepository.save(task);
    }

    @Override
    public List<Task> filterTasksByStatus(String status) {
        // TODO: Implement filterTasksByStatus method
        return null;
    }

    @Override
    public void sendReminder(Long taskId) {

    }

    @Override
    public String generateProjectReport(Long projectId) {
        // TODO: Implement generateProjectReport method
        return "Project Report";
    }

    @Override
    public Task assignDuration(Long taskId, Integer estimatedWeeks, Double effortPercentage) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        // Calculate estimated duration
        Double estimatedDuration = null;

        if (estimatedWeeks != null) {
            // Assume a 40-hour work week
            estimatedDuration = estimatedWeeks * 40.0;
        } else if (effortPercentage != null && task.getDeadline() != null) {
            // Calculate hours until deadline
            LocalDateTime now = LocalDateTime.now();
            long hoursUntilDeadline = ChronoUnit.HOURS.between(now, task.getDeadline());
            estimatedDuration = hoursUntilDeadline * (effortPercentage / 100.0);
        }

        // Update task with calculated values
        task.setEstimatedDuration(estimatedDuration);
        task.setEstimatedWeeks(estimatedWeeks);
        task.setEffortPercentage(effortPercentage);

        return taskRepository.save(task);
    }

    @Override
    public double calculateTaskProgress(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        if (task.getEstimatedDuration() == null || task.getEstimatedDuration() == 0) {
            return 0; // Avoid division by zero
        }
        return (task.getTimeSpent() / task.getEstimatedDuration()) * 100; // Progress in percentage
    }
}
