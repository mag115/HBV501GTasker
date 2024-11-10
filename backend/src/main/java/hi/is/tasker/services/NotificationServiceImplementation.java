package hi.is.tasker.services;

import hi.is.tasker.entities.Notification;
import hi.is.tasker.entities.User;
import hi.is.tasker.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationServiceImplementation implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationServiceImplementation(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

 /*   @Override
    public Notification createNotification(String message, User recipient) {
        Notification notification = new Notification(message, recipient);
        Notification savedNotification = notificationRepository.save(notification);
        System.out.println("Saved notification with ID: " + savedNotification.getId());
        return savedNotification;
    }*/

    @Override
    public Notification createNotification(String message, User recipient) {
        Notification notification = new Notification(message, recipient);
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getNotificationsForUser(User recipient) {
        System.out.println("Fetching notifications for user: " + recipient.getId());
        return notificationRepository.findByRecipient(recipient);
    }

    @Override
    public List<Notification> getUnreadNotificationsForUser(User recipient) {
        return notificationRepository.findByRecipientAndIsRead(recipient, false);
    }

    @Override
    public void markAsRead(Long notificationId) {
        Optional<Notification> notification = notificationRepository.findById(notificationId);
        if (notification.isPresent()) {
            notification.get().setRead(true);
            notificationRepository.save(notification.get());
        }
    }
}