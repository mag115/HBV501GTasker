package hi.is.tasker.services;

import hi.is.tasker.dto.ReportOptions;
import hi.is.tasker.entities.ProjectReport;
import hi.is.tasker.entities.Task;
import hi.is.tasker.repositories.ProjectReportRepository;
import hi.is.tasker.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;

@Service
public class ProjectReportServiceImplementation implements ProjectReportService {

    private final ProjectReportRepository projectReportRepository;
    private final TaskRepository taskRepository;
    private final TaskService taskService;

    @Autowired
    public ProjectReportServiceImplementation(
            ProjectReportRepository projectReportRepository,
            TaskRepository taskRepository,
            TaskService taskService
    ) {
        this.projectReportRepository = projectReportRepository;
        this.taskRepository = taskRepository;
        this.taskService = taskService;
    }

    @Override
    public List<ProjectReport> getAllReports() {
        return projectReportRepository.findAll();
    }

    public ProjectReport generateProjectReport(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);

        String overallPerformance = calculateOverallPerformance(tasks);
        ProjectReport report = new ProjectReport(tasks, overallPerformance);
        projectReportRepository.deleteAll();
        projectReportRepository.save(report);

        return report;
    }

    private String calculateOverallPerformance(List<Task> tasks) {
        double totalScheduledProgress = 0.0;
        double totalActualProgress = 0.0;

        for (Task task : tasks) {
            //skip tasks without deadlines or estimated durations
            if (task.getDeadline() == null || task.getEstimatedDuration() == null || task.getEstimatedDuration() <= 0) {
                continue;
            }

            //update the task's progress to ensure it's up-to-date
            taskService.calculateAndUpdateTaskProgress(task);

            //get actual progress
            double actualProgress = task.getProgress() != null ? task.getProgress() : 0.0;

            //calculate scheduled progress
            double scheduledProgress = calculateTaskScheduledProgress(task);

            totalScheduledProgress += scheduledProgress;
            totalActualProgress += actualProgress;
        }

        if (totalScheduledProgress == 0) {
            return "On Track";
        }

        //determine overall performance
        if (totalActualProgress >= totalScheduledProgress) {
            return "On Track";
        } else {
            return "Behind Schedule";
        }
    }

    //helper method to calculate scheduled progress for a task
    private double calculateTaskScheduledProgress(Task task) {
        LocalDateTime now = LocalDateTime.now();
        double estimatedDurationInSeconds = task.getEstimatedDuration() * 3600;
        LocalDateTime taskStart = task.getDeadline().minusSeconds((long) estimatedDurationInSeconds);

        long totalDurationSeconds = ChronoUnit.SECONDS.between(taskStart, task.getDeadline());
        long elapsedTimeSeconds = ChronoUnit.SECONDS.between(taskStart, now);

        double scheduledProgress = Math.min(((double) elapsedTimeSeconds / totalDurationSeconds) * 100, 100);

        return scheduledProgress;
    }

    public ProjectReport generateCustomProjectReport(Long projectId, ReportOptions options) {
        List<Task> tasks = options.isIncludeTasks() ? taskRepository.findByProjectId(projectId) : Collections.emptyList();

        long totalTimeSpent = 0;


        String overallPerformance = null;
        if (options.isIncludePerformance()) {
            overallPerformance = calculateOverallPerformance(tasks);
        }

        ProjectReport report = new ProjectReport(
                tasks.isEmpty() ? null : tasks,
                options.isIncludePerformance() ? overallPerformance : null
        );
        projectReportRepository.deleteAll();
        projectReportRepository.save(report);

        return report;
    }

    @Override
    public ProjectReport getReportById(Long id) {
        return projectReportRepository.findById(id).orElse(null);
    }
}
