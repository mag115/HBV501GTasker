package hi.is.tasker.services;

import hi.is.tasker.entities.Notification;
import hi.is.tasker.entities.User;

import java.util.List;

public interface NotificationService {
    Notification createNotification(String message, User recipient);
    List<Notification> getNotificationsForUser(User recipient);
    List<Notification> getUnreadNotificationsForUser(User recipient);
    void markAsRead(Long notificationId);
}