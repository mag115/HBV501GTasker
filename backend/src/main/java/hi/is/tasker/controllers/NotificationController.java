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

    // Send reminders for each assigned task to all users in the system
    @PostMapping("/send")
    public ResponseEntity<String> sendTaskReminders() {
        // Fetch all users in the system
        List<User> users = userService.getAllUsers();

        for (User user : users) {
            // Find tasks assigned to the current user
            List<Task> assignedTasks = taskService.getTasksAssignedToUser(user.getUsername());

            for (Task task : assignedTasks) {
                // Create a reminder notification for each assigned task
                String message = "Reminder: You have an assigned task '" + task.getTitle() + "' with a deadline on " + task.getDeadline();
                notificationService.createNotification(message, user);
            }
        }

        return ResponseEntity.ok("Reminders sent for all assigned tasks.");
    }

    // Send a task assignment notification to the assigned user
    @PostMapping("/{taskId}/send")
    public ResponseEntity<Void> sendTaskAssignmentNotification(@PathVariable Long taskId, @RequestBody Long assignedUserId) {
        Task task = taskService.findById(taskId);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }

        User assignedUser = userService.getUserById(assignedUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create a notification specific to the assigned task and user
        String message = "You have been assigned a new task: '" + task.getTitle() + "'.";
        notificationService.createNotification(message, assignedUser);

        return ResponseEntity.ok().build();
    }

    // Retrieve notifications for a user by userId
    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsForUser(@PathVariable Long userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Notification> notifications = notificationService.getNotificationsForUser(user);

        // Add this log to verify notifications are being fetched
        System.out.println("Fetched " + notifications.size() + " notifications for user: " + user.getUsername());

        return ResponseEntity.ok(notifications);
    }


    // Mark a notification as read by notificationId
    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok().build();
    }

    // Send a deadline reminder for a specific task to the assigned user
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

