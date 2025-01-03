package hi.is.tasker.services;

import hi.is.tasker.entities.Project;
import hi.is.tasker.entities.Task;
import hi.is.tasker.entities.User;
import hi.is.tasker.repositories.ProjectRepository;
import hi.is.tasker.repositories.TaskRepository;
import hi.is.tasker.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class TaskServiceImplementation implements TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final NotificationService notificationService;

    @Autowired
    public TaskServiceImplementation(TaskRepository taskRepository, UserRepository userRepository, NotificationService notificationService, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.projectRepository = projectRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Task> findAll(Long projectId) {
        if (projectId != null) {
            return taskRepository.findByProjectId(projectId);
        } else {
            return taskRepository.findAll();
        }
    }

    @Override
    public List<Task> getTasksAssignedToUser(String username, Long projectId) {
        if (projectId != null) {
            return taskRepository.findByAssignedUserUsernameAndProjectId(username, projectId);
        } else {
            return taskRepository.findByAssignedUserUsername(username);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Task findById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    @Override
    public Task createTask(Task task, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        task.setProject(project);
        return taskRepository.save(task);
    }

    public Task save(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public List<Task> findTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @Override
    public Task updateTimeSpent(Long taskId, double timeSpent) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        task.setTimeSpent(timeSpent);
        calculateAndUpdateTaskProgress(task);
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

        // Ensure the user is a member of the task's project
        if (!task.getProject().getMembers().contains(user)) {
            throw new RuntimeException("User is not a member of the project");
        }

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
        return null;
    }

    @Override
    public void sendReminder(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        User assignedUser = task.getAssignedUser();
        if (assignedUser == null) {
            System.out.println("No user assigned to the task with id: " + taskId);
            return;
        }

        String message = "Reminder: You have a pending task: " + task.getTitle();
        notificationService.createNotification(message, assignedUser);

        System.out.println("Reminder notification sent to " + assignedUser.getUsername());
    }

    @Override
    public String generateProjectReport(Long projectId) {
        return "Project Report";
    }


    @Override
    public Task assignDuration(Long taskId, Integer estimatedWeeks, Double effortPercentage) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));

        //deadline bbased on effortPercentage or weeks
        if (task.getDeadline() == null) {
            throw new IllegalStateException("Deadline must be set to calculate estimated duration.");
        }

        long hoursUntilDeadline = ChronoUnit.HOURS.between(LocalDateTime.now(), task.getDeadline());
        long daysUntilDeadline = ChronoUnit.DAYS.between(LocalDateTime.now(), task.getDeadline());
        double hoursAvailable = daysUntilDeadline * 8.0;
        System.out.print(hoursAvailable);

        double maxWeeks = hoursUntilDeadline / 40.0; // 40 hours per week
        if (estimatedWeeks != null && estimatedWeeks > maxWeeks) {
            throw new IllegalArgumentException("The estimated duration in weeks exceeds the time available until the deadline.");
        }

        //estimated duration based on the weeks or effort percentage
        Double estimatedDuration = null;
        if (estimatedWeeks != null) {
            estimatedDuration = Math.min(estimatedWeeks * 40.0, hoursUntilDeadline);
        } else if (effortPercentage != null) {
            estimatedDuration = Math.min(hoursAvailable * (effortPercentage / 100.0), hoursAvailable);
        }

        task.setEstimatedDuration(estimatedDuration);
        task.setEstimatedWeeks(estimatedWeeks);
        task.setEffortPercentage(effortPercentage);
        calculateAndUpdateTaskProgress(task);
        return taskRepository.save(task);
    }

    @Override
    public void calculateAndUpdateTaskProgress(Task task) {
        if (task.getEstimatedDuration() == null || task.getEstimatedDuration() <= 0 || task.getDeadline() == null) {
            task.setProgress(0.0);
            task.setProgressStatus("Not Started");
            return;
        }

        double estimatedDurationInSeconds = task.getEstimatedDuration() * 3600;

        //actual Progress: (Logged Hours / Estimated Hours) * 100
        double actualProgress = Math.min((task.getTimeSpent() / estimatedDurationInSeconds) * 100, 100);
        task.setProgress((double) Math.round(actualProgress));

        //scheduled Progress based on deadline and estimated duration
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime taskStart = task.getDeadline().minusSeconds((long) estimatedDurationInSeconds);

        double scheduledProgress;
        if (now.isBefore(task.getDeadline())) {
            long totalDuration = ChronoUnit.SECONDS.between(taskStart, task.getDeadline());
            long elapsedTime = ChronoUnit.SECONDS.between(taskStart, now);

            //scheduled Progress = (Elapsed Time / Total Time Until Deadline) * 100
            scheduledProgress = Math.min(((double) elapsedTime / totalDuration) * 100, 100);
        } else {
            scheduledProgress = 100.0;
        }

        if (actualProgress >= scheduledProgress) {
            task.setProgressStatus("On Track");
        } else {
            task.setProgressStatus("Behind Schedule");
        }

        taskRepository.save(task);
    }

    @Override
    public Task updateTaskProgress(Long taskId, Double manualProgress) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        task.setManualProgress(manualProgress);
        calculateAndUpdateTaskProgress(task);
        return taskRepository.save(task);
    }

    @Override
    public List<Task> findTasksWithUpcomingDeadlines(int days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime deadlineThreshold = now.plusDays(days);
        return taskRepository.findByDeadlineBetween(now, deadlineThreshold);
    }
}
