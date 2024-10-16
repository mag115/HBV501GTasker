package hi.is.tasker.services;

import hi.is.tasker.entities.Task;
import hi.is.tasker.entities.TimeTracking;
import hi.is.tasker.repositories.TimeTrackingRepository;
import hi.is.tasker.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TimeTrackingImplementation implements TimeTrackingService {
    private final TimeTrackingRepository timeTrackingRepository;
    private final TaskRepository taskRepository;

    @Autowired
    public TimeTrackingImplementation(TimeTrackingRepository timeTrackingRepository, TaskRepository taskRepository) {
        this.timeTrackingRepository = timeTrackingRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    public TimeTracking startTracking(Long taskId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));

        TimeTracking timeTracking = new TimeTracking();
        timeTracking.setTask(task);
        timeTracking.setStartTime(LocalDateTime.now());
        return timeTrackingRepository.save(timeTracking);
    }

    @Override
    public TimeTracking stopTracking(Long taskId) {
        TimeTracking timeTracking = timeTrackingRepository.findByTaskId(taskId)
                .stream()
                .filter(t -> t.getEndTime() == null)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No active time tracking found"));

        timeTracking.setEndTime(LocalDateTime.now());
        timeTracking.setTimeSpent(calculateTimeSpent(timeTracking.getStartTime(), timeTracking.getEndTime()));
        return timeTrackingRepository.save(timeTracking);
    }

    @Override
    public TimeTracking manualEntry(Long taskId, double timeSpent) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        TimeTracking timeTracking = new TimeTracking();
        timeTracking.setTask(task);
        timeTracking.setTimeSpent(timeSpent);
        timeTracking.setStartTime(LocalDateTime.now());
        timeTracking.setEndTime(LocalDateTime.now()); // manual entry is for a completed period

        return timeTrackingRepository.save(timeTracking);
    }

    @Override
    public List<TimeTracking> getTimeLogsForTask(Long taskId) {
        return timeTrackingRepository.findByTaskId(taskId);
    }

    private double calculateTimeSpent(LocalDateTime start, LocalDateTime end) {
        return (double) java.time.Duration.between(start, end).toMinutes() / 60;  // Convert minutes to hours
    }
}