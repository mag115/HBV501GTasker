package hi.is.tasker.services.implementation;

import hi.is.tasker.entities.ProjectReport;
import hi.is.tasker.entities.Task;
import hi.is.tasker.repositories.ProjectReportRepository;
import hi.is.tasker.repositories.TaskRepository;
import hi.is.tasker.services.ProjectReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectReportServiceImplementation implements ProjectReportService {

    private final ProjectReportRepository projectReportRepository;
    private final TaskRepository taskRepository;

    @Autowired
    public ProjectReportServiceImplementation(ProjectReportRepository projectReportRepository, TaskRepository taskRepository) {
        this.projectReportRepository = projectReportRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    public ProjectReport generateReport(List<Long> taskIds) {
        List<Task> tasks = taskRepository.findAllById(taskIds);
        long totalTimeSpent = 0;
        String overallPerformance = "On Track";

        ProjectReport report = new ProjectReport(tasks, totalTimeSpent, overallPerformance);
        return projectReportRepository.save(report);
    }

    @Override
    public ProjectReport getReportById(Long id) {
        return projectReportRepository.findById(id).orElse(null);
    }
}