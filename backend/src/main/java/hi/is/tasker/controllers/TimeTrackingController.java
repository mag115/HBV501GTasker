package hi.is.tasker.controllers;

import hi.is.tasker.entities.Task;
import hi.is.tasker.repositories.TaskRepository;
import hi.is.tasker.services.TaskService;
import hi.is.tasker.entities.TimeTracking;
import hi.is.tasker.repositories.TimeTrackingRepository;
import hi.is.tasker.services.TimeTrackingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


import java.util.List;

@RestController
@RequestMapping("/tasks/{taskId}/time")
public class TimeTrackingController {
    private final TimeTrackingService timeTrackingService;

    public TimeTrackingController(TimeTrackingService timeTrackingService) {
        this.timeTrackingService = timeTrackingService;
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