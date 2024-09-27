package hi.is.tasker.repositories;

import hi.is.tasker.entities.ProjectReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectReportRepository extends JpaRepository<ProjectReport, Long> {
    // idk
}
