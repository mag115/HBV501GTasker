package hi.is.tasker.services;

import hi.is.tasker.entities.Task;
import hi.is.tasker.entities.User;
import hi.is.tasker.repositories.TaskRepository;
import hi.is.tasker.repositories.TimeTrackingRepository;
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
    private final TimeTrackingRepository timeTrackingRepository;
    private final NotificationService notificationService;

    @Autowired
    public TaskServiceImplementation(TaskRepository taskRepository, UserRepository userRepository, TimeTrackingRepository timeTrackingRepository, NotificationService notificationService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.timeTrackingRepository = timeTrackingRepository;
        this.notificationService = notificationService;
    }


    @Override
    public List<Task> findAll() {
        List<Task> tasks = taskRepository.findAll();
        tasks.forEach(task -> System.out.println("Task: " + task.getTitle() + ", Assigned User: " + (task.getAssignedUser() != null ? task.getAssignedUser().getUsername() : "Unassigned")));
        return tasks;
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

        task.setTimeSpent(timeSpent);
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
    public Task setDependency(Long taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setDependency(taskId);
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
        // Fetch the task by taskId
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        // Check if a user is assigned to the task
        User assignedUser = task.getAssignedUser();
        if (assignedUser == null) {
            System.out.println("No user assigned to the task with id: " + taskId);
            return;
        }

        // Create a reminder notification for the assigned user
        String message = "Reminder: You have a pending task: " + task.getTitle();
        notificationService.createNotification(message, assignedUser);

        System.out.println("Reminder notification sent to " + assignedUser.getUsername());
    }

    @Override
    public String generateProjectReport(Long projectId) {
        // TODO: Implement generateProjectReport method
        return "Project Report";
    }

    @Override
    public Task assignDuration(Long taskId, Integer estimatedWeeks, Double effortPercentage) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));

        Double estimatedDuration = null;
        if (estimatedWeeks != null) {
            estimatedDuration = estimatedWeeks * 40.0;  // Assuming a 40-hour work week
        } else if (effortPercentage != null && task.getDeadline() != null) {
            LocalDateTime now = LocalDateTime.now();
            long hoursUntilDeadline = ChronoUnit.HOURS.between(now, task.getDeadline());
            estimatedDuration = hoursUntilDeadline * (effortPercentage / 100.0);
        }

        task.setEstimatedDuration(estimatedDuration);
        task.setEstimatedWeeks(estimatedWeeks);
        task.setEffortPercentage(effortPercentage);
        return taskRepository.save(task);
    }

    @Override
    public double calculateTaskProgress(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (task.getEstimatedDuration() == null || task.getEstimatedDuration() == 0) {
            return 0;
        }

        double progressPercentage = (task.getTimeSpent() / task.getEstimatedDuration()) * 100;
        task.setProgressStatus(progressPercentage >= 100 ? "Completed" : "In Progress");
        taskRepository.save(task);

        return progressPercentage;
    }

    @Override
    public String getProgressStatus(Long taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
        double progressPercentage = calculateTaskProgress(taskId);
        LocalDateTime now = LocalDateTime.now();
        long hoursUntilDeadline = task.getDeadline() != null ? ChronoUnit.HOURS.between(now, task.getDeadline()) : 0;

        if (progressPercentage >= 100) {
            return "Completed";
        } else if (progressPercentage < 100 && hoursUntilDeadline <= 0) {
            return "Behind Schedule";
        } else if (progressPercentage < 100 && hoursUntilDeadline > 0) {
            return "On Track";
        } else {
            return "Unknown";
        }
    }

    @Override
    public Task updateTaskProgress(Long taskId, Double progress) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        task.setProgress(progress);
        return taskRepository.save(task);
    }

    @Override
    public List<Task> findTasksWithUpcomingDeadlines(int days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime deadlineThreshold = now.plusDays(days);
        return taskRepository.findByDeadlineBetween(now, deadlineThreshold);
    }
}
