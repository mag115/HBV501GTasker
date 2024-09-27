package hi.is.tasker.controllers;

import hi.is.tasker.services.NotificationService;
import hi.is.tasker.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public void sendNotification() {
    }

    @GetMapping("/{userId}")
    public void getNotificationsForUser() {
    }

    @PatchMapping("/{notificationId}/read")
    public void markNotificationAsRead() {
    }
}
