package hi.is.tasker.repositories;

import hi.is.tasker.entities.TimeTracking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TimeTrackingRepository extends JpaRepository<TimeTracking, Long>{
    //kannski hafa þetta, finna allt time tracking fyrir ehv spes task
    List<TimeTracking> findByTaskId(Long taskId);
}