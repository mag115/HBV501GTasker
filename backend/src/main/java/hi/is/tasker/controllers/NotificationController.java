package hi.is.tasker.controllers;

import hi.is.tasker.entities.Notification;
import hi.is.tasker.entities.Task;
import hi.is.tasker.entities.User;
import hi.is.tasker.services.NotificationService;
import hi.is.tasker.services.TaskService;
import hi.is.tasker.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;
    private final TaskService taskService;

    @Autowired
    public NotificationController(NotificationService notificationService, UserService userService, TaskService taskService) {
        this.notificationService = notificationService;
        this.userService = userService;
        this.taskService = taskService;
    }


    @PostMapping("/send")
    public ResponseEntity<String> sendTaskReminders() {
        // Fetch all users in the system
        List<User> users = userService.getAllUsers();

        for (User user : users) {
            List<Task> assignedTasks = taskService.getTasksAssignedToUser(user.getUsername(), null);

            for (Task task : assignedTasks) {
                String message = "Reminder: You have an assigned task '" + task.getTitle() + "' with a deadline on " + task.getDeadline();
                notificationService.createNotification(message, user);
            }
        }

        return ResponseEntity.ok("Reminders sent for all assigned tasks.");
    }

    @PostMapping("/{taskId}/send")
    public ResponseEntity<Void> sendTaskAssignmentNotification(@PathVariable Long taskId, @RequestBody Long assignedUserId) {
        Task task = taskService.findById(taskId);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }

        User assignedUser = userService.getUserById(assignedUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String message = "You have been assigned a new task: '" + task.getTitle() + "'.";
        notificationService.createNotification(message, assignedUser);

        return ResponseEntity.ok().build();
    }

    //retrieve notifications for a user by userId
    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsForUser(@PathVariable Long userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Notification> notifications = notificationService.getNotificationsForUser(user);

        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable Long userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Notification> notifications = notificationService.getUnreadNotificationsForUser(user);

        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{taskId}/{userId}/comment")
    public ResponseEntity<String> sendTaskComment(@PathVariable Long taskId, @PathVariable Long userId, @RequestBody Map<String, String> requestBody) {
        Task task = taskService.findById(taskId);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }

        User assignedUser = task.getAssignedUser();
        if (assignedUser == null) {
            return ResponseEntity.badRequest().body("No user is assigned to this task.");
        }

        User commentingUser = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("Commenting user not found"));

        String comment = requestBody.get("comment");
        if (comment == null || comment.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Comment text is required.");
        }

        //create a notification message with the comment and name
        String message = "New comment on task '" + task.getTitle() + "' from " + commentingUser.getUsername() + ": " + comment;
        notificationService.createNotification(message, assignedUser);

        return ResponseEntity.ok("Notification sent with custom comment from " + commentingUser.getUsername() + ".");
    }

    @PostMapping("/tasks/{taskId}/reminder")
    public ResponseEntity<String> sendDeadlineReminder(@PathVariable Long taskId) {
        Task task = taskService.findById(taskId);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }

        User assignedUser = task.getAssignedUser();
        if (assignedUser != null) {
            String message = "Reminder: The deadline for task '" + task.getTitle() + "' is approaching on " + task.getDeadline();
            notificationService.createNotification(message, assignedUser);
            return ResponseEntity.ok("Reminder sent to assigned user.");
        }

        return ResponseEntity.badRequest().body("No user is assigned to this task.");
    }
}

