package hi.is.tasker.repositories;

import hi.is.tasker.entities.Notification;
import hi.is.tasker.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipient(User recipient);
    List<Notification> findByRecipientAndIsRead(User recipient, boolean isRead);
}