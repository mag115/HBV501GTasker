package hi.is.tasker.repositories;

import hi.is.tasker.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findAllByDeadlineBeforeAndReminderSentFalse(LocalDateTime deadline);
}
