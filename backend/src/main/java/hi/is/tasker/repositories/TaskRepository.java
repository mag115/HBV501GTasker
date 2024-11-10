package hi.is.tasker.repositories;

import hi.is.tasker.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findAllByDeadlineBeforeAndReminderSentFalse(LocalDateTime deadline);

    //Nýjar pælingar, hafa þetta líka eða nei?:
    List<Task> findAllByStatus(String status);

    List<Task> findAllByAssignedUserId(Long userId);

    List<Task> findAllByPriority(String priority);

    List<Task> findByAssignedUserUsername(String username);

    List<Task> findByDeadlineBetween(LocalDateTime start, LocalDateTime end);

}
