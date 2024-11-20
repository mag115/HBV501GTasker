package hi.is.tasker.services;

import hi.is.tasker.entities.TimeTracking;
import java.util.List;

public interface TimeTrackingService {
    TimeTracking startTracking(Long taskId);
    TimeTracking stopTracking(Long taskId);
    TimeTracking manualEntry(Long taskId, double timeSpent);
    List<TimeTracking> getTimeLogsForTask(Long taskId);
}