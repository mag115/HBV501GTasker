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

import java.time.Duration;
import java.time.LocalDateTime;
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
    public List<ProjectReport> getAllReports() {
        return projectReportRepository.findAll();  // Fetch all project reports
    }

    public ProjectReport generateProjectReport() {
        // Fetch all tasks
        List<Task> tasks = taskRepository.findAll();

        // Calculate total time spent on tasks using TimeTracking
        long totalTimeSpent = tasks.stream()
                .mapToLong(this::calculateTotalTimeSpentForTask)
                .sum();

        // Determine overall performance based on deadlines
        String overallPerformance = calculateOverallPerformance(tasks);

        // Create a ProjectReport entity
        ProjectReport report = new ProjectReport(tasks, totalTimeSpent, overallPerformance);
        projectReportRepository.save(report);

        return report;
    }

    private long calculateTotalTimeSpentForTask(Task task) {
        // Sum up all the time spent for each time tracking entry related to the task
        return task.getTimeTrackings().stream()
                .mapToLong(tt -> (long) tt.getTimeSpent())  // Assuming timeSpent is in hours, adapt if necessary
                .sum();
    }

    private String calculateOverallPerformance(List<Task> tasks) {
        LocalDateTime now = LocalDateTime.now();
        long tasksBehindSchedule = tasks.stream()
                .filter(task -> task.getDeadline() != null && task.getDeadline().isBefore(now) && !task.getStatus().equals("Completed"))
                .count();

        return tasksBehindSchedule > 0 ? "Behind Schedule" : "On Track";
    }


    @Override
    public ProjectReport getReportById(Long id) {
        return projectReportRepository.findById(id).orElse(null);
    }
}