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
    public TaskServiceImplementation(TimeTrackingRepository timeTrackingRepository, TaskRepository taskRepository) {
        this.timeTrackingRepository = timeTrackingRepository;
        this.taskRepository = taskRepository;
    }

    //TODO: implementa
    @Override
    public TimeTracking startTracking(Long taskId) {return null;}

    @Override
    public TimeTracking stopTracking(Long taskId) {return null;}

    @Override
    public TimeTracking manualEntry(Long taskId, double timeSpent) {return null;}

    @Override
    public List<TimeTracking> getTimeLogsForTask(Long taskId) {return null;}

    @Override
    public TimeTracking startTracking(Long taskId) {return null;}

    private double calculateTimeSpent(LocalDateTime start, LocalDateTime end) {
        return (double) java.time.Duration.between(start, end).toMinutes() / 60;  // í klst
    }
}