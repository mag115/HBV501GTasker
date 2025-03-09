package hi.is.tasker.services;

import hi.is.tasker.entities.Notification;
import hi.is.tasker.entities.User;
import hi.is.tasker.repositories.NotificationRepository;
import hi.is.tasker.repositories.UserRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationServiceImplementation implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final String FCM_SERVER_KEY = "YOUR_FIREBASE_SERVER_KEY"; // 🔥 Replace with actual key

    @Autowired
    public NotificationServiceImplementation(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Notification createNotification(String message, User recipient) {
        Notification notification = new Notification(message, recipient);
        notificationRepository.save(notification);

        sendPushNotification(recipient, message);

        return notificationRepository.save(notification);
    }

    private void sendPushNotification(User recipient, String message) {
        if (recipient.getFcmToken() == null || recipient.getFcmToken().isEmpty()) {
            System.out.println("❌ No FCM token for user: " + recipient.getUsername());
            return;
        }

        try {
            JSONObject body = new JSONObject();
            body.put("to", recipient.getFcmToken());

            JSONObject notification = new JSONObject();
            notification.put("title", "Tasker Notification");
            notification.put("body", message);

            body.put("notification", notification);

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + FCM_SERVER_KEY);

            HttpEntity<String> request = new HttpEntity<>(body.toString(), headers);
            restTemplate.exchange("https://fcm.googleapis.com/fcm/send", HttpMethod.POST, request, String.class);

            System.out.println("✅ FCM Notification Sent!");
        } catch (Exception e) {
            System.out.println("❌ Error sending FCM notification: " + e.getMessage());
        }
    }

    @Override
    public List<Notification> getNotificationsForUser(User recipient) {
        System.out.println("Fetching notifications for user: " + recipient.getId());
        return notificationRepository.findByRecipient(recipient);
    }

    @Override
    public List<Notification> getUnreadNotificationsForUser(User recipient) {
        System.out.println("Fetching unread noti for user: " + recipient.getId());
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
