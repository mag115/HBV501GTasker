package hi.is.tasker.controllers;

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
    public void getNotificationsForUser() {
    }

    @PatchMapping("/{notificationId}/read")
    public void markNotificationAsRead() {
    }

    @PostMapping("/tasks/{taskId}/reminder")
    public void sendDeadlineReminder() {
    }
}

