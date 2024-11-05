package hi.is.tasker.services;


import hi.is.tasker.entities.ProjectReport;
import java.util.List;
public interface ProjectReportService {
    ProjectReport getReportById(Long id);

    List<ProjectReport> getAllReports();

    ProjectReport generateProjectReport();
}