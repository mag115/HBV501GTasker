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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/tasks/{taskId}/time")
public class TimeTrackingController {
    private final TimeTrackingService timeTrackingService;

    public TimeTrackingController(TimeTrackingService timeTrackingService) {
        this.timeTrackingService = timeTrackingService;
    }

    @PostMapping("/start")
    public ResponseEntity<TimeTracking> startTracking(@PathVariable Long taskId) {
        TimeTracking timeTracking = timeTrackingService.startTracking(taskId);
        return ResponseEntity.ok(timeTracking);
    }

    @PostMapping("/stop")
    public ResponseEntity<TimeTracking> stopTracking(@PathVariable Long taskId) {
        TimeTracking timeTracking = timeTrackingService.stopTracking(taskId);
        return ResponseEntity.ok(timeTracking);
    }

    @PatchMapping("/manual")
    public ResponseEntity<TimeTracking> manualEntry(
            @PathVariable Long taskId,
            @RequestParam double timeSpent) {
        TimeTracking timeTracking = timeTrackingService.manualEntry(taskId, timeSpent);
        return ResponseEntity.ok(timeTracking);
    }

    @GetMapping("/logs")
    public ResponseEntity<List<TimeTracking>> getTimeLogsForTask(@PathVariable Long taskId) {
        List<TimeTracking> timeLogs = timeTrackingService.getTimeLogsForTask(taskId);
        return ResponseEntity.ok(timeLogs);
    }
}