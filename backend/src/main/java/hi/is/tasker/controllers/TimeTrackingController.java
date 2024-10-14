package hi.is.tasker.controllers;

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
@RequestMapping("/tasks/{taskId}/time")
public class TimeTrackingController {
    private final TimeTrackingService timeTrackingService;

    public TimeTrackingService(TimeTrackingRepository timeTrackingRepository, TaskRepository taskRepository) {
        this.timeTrackingRepository = timeTrackingRepository;
        this.taskRepository = taskRepository;
    }

    @PostMapping("/start")
    public TimeTracking startTracking(@PathVariable Long taskId) {
        return timeTrackingService.startTracking(taskId);
    }

    @PostMapping("/stop")
    public TimeTracking stopTracking(@PathVariable Long taskId) {
        return timeTrackingService.stopTracking(taskId);
    }

    @PatchMapping("/manual")
    public TimeTracking manualEntry(@PathVariable Long taskId, @RequestBody double timeSpent) {
        return timeTrackingService.manualEntry(taskId, timeSpent);
    }

    @GetMapping
    public List<TimeTracking> getTimeLogs(@PathVariable Long taskId) {
        return timeTrackingService.getTimeLogsForTask(taskId);
    }
}