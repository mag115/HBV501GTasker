package hi.is.tasker.services;

import hi.is.tasker.entities.ProjectReport;
import hi.is.tasker.entities.Task;
import hi.is.tasker.entities.TimeTracking;
import hi.is.tasker.repositories.ProjectReportRepository;
import hi.is.tasker.repositories.TaskRepository;
import hi.is.tasker.repositories.TimeTrackingRepository;
import hi.is.tasker.services.ProjectReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectReportServiceImplementation implements ProjectReportService {

    private final ProjectReportRepository projectReportRepository;
    private final TaskRepository taskRepository;
    private final TimeTrackingRepository timeTrackingRepository;

    @Autowired
    public ProjectReportServiceImplementation(
            ProjectReportRepository projectReportRepository,
            TaskRepository taskRepository,
            TimeTrackingRepository timeTrackingRepository
    ) {
        this.projectReportRepository = projectReportRepository;
        this.taskRepository = taskRepository;
        this.timeTrackingRepository = timeTrackingRepository; // Initialize here
    }

    @Override
    public ProjectReport generateReport(List<Long> taskIds) {
        List<Task> tasks = taskRepository.findAllById(taskIds);

        long totalTimeSpent = (long) tasks.stream()
                .flatMap(task -> timeTrackingRepository.findByTaskId(task.getId()).stream())
                .mapToDouble(TimeTracking::getTimeSpent)
                .sum();

        String overallPerformance = totalTimeSpent > 100 ? "Behind Schedule" : "On Track";

        ProjectReport report = new ProjectReport(tasks, totalTimeSpent, overallPerformance);
        return projectReportRepository.save(report);
    }

    @Override
    public ProjectReport getReportById(Long id) {
        return projectReportRepository.findById(id).orElse(null);
    }
}