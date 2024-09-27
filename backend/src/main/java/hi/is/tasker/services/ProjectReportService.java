package hi.is.tasker.services;

import hi.is.tasker.entities.ProjectReport;
import java.util.List;
public interface ProjectReportService {
    ProjectReport generateReport(List<Long> taskIds);
    ProjectReport getReportById(Long id);
}