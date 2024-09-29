package hi.is.tasker.repositories;

import hi.is.tasker.entities.ProjectReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectReportRepository extends JpaRepository<ProjectReport, Long> {
    // Random methods hugmyndir...???
    List<ProjectReport> findByReportDate(LocalDateTime reportDate);
    List<ProjectReport> findAllByReportDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<ProjectReport> findByTasks_Id(Long taskId);
    List<ProjectReport> findByOverallPerformance(String overallPerformance);
}
