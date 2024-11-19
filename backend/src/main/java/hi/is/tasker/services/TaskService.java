package hi.is.tasker.services;

import hi.is.tasker.entities.Task;

import java.util.List;

public interface TaskService {
    Task createTask(Task task, Long projectId);

    List<Task> findAll(Long projectId);

    Task findById(Long id);

    void delete(Task task);

    Task assignTask(Long taskId, Long userId);

    Task updateTaskStatus(Long taskId, String status);

    Task updateTaskPriority(Long taskId, String priority);

    List<Task> getTasksAssignedToUser(String username, Long projectId);

    void calculateAndUpdateTaskProgress(Task task);

    List<Task> filterTasksByStatus(String status);

    void sendReminder(Long taskId);

    String generateProjectReport(Long projectId);

    Task updateTimeSpent(Long taskId, double timeSpent);

    Task assignDuration(Long taskId, Integer estimatedWeeks, Double effortPercentage);

    Task setDependency(Long taskId);

    Task updateTaskProgress(Long taskId, Double progress);

    List<Task> findTasksWithUpcomingDeadlines(int days);

    List<Task> findTasksByProjectId(Long projectId);

    Task save(Task task);
}
