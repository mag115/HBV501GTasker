package hi.is.tasker.services;

import hi.is.tasker.entities.Task;

import java.util.List;

public interface TaskService {
    //Task createTask(Task task);
    List<Task> findAll();

    Task findById(Long id);

    Task save(Task task);

    void delete(Task task);

    Task assignTask(Long taskId, Long userId);

    Task updateTaskStatus(Long taskId, String status);

    Task updateTaskPriority(Long taskId, String priority);

    List<Task> getTasksAssignedToUser(String username);

    List<Task> filterTasksByStatus(String status);

    void sendReminder(Long taskId);

    String generateProjectReport(Long projectId);
    
    Task updateTimeSpent(Long taskId, double timeSpent);

}
