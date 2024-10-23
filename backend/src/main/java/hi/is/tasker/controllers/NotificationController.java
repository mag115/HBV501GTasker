package hi.is.tasker.controllers;

import hi.is.tasker.entities.Notification;
import hi.is.tasker.entities.User;
import hi.is.tasker.services.NotificationService;
import hi.is.tasker.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @Autowired
    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @PostMapping("/send")
    public ResponseEntity<Void> sendTaskAssignmentNotification() {
        List<User> allUsers = userService.getAllUsers();
        String message = "A new task has been assigned to your team.";
        System.out.println("TRY TO CREATE NOTIFIACTION");
        if (allUsers.isEmpty()) {
            System.out.println("No users found in the system.");
        } else {
            System.out.println("Found users: " + allUsers.size());
            for (User user : allUsers) {
                System.out.println("User ID: " + user.getId() + ", Username: " + user.getUsername());
            }
        }
        for (User user : allUsers) {
            System.out.println("Created notification for user: " + user.getId());
            notificationService.createNotification(message, user);
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsForUser(
            @PathVariable Long userId,
            @RequestParam(value = "filter", required = false) String filter) {

        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Notification> notifications;

        if ("unread".equalsIgnoreCase(filter)) {
            notifications = notificationService.getUnreadNotificationsForUser(user);
        } else {
            notifications = notificationService.getNotificationsForUser(user);
        }

        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/tasks/{taskId}/reminder")
    public void sendDeadlineReminder() {
    }
}

