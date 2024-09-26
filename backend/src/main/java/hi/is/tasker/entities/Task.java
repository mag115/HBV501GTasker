package hi.is.tasker.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity(name = "task")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDateTime deadline;
    private Boolean reminderSent;

    //nýtt:
    private String status;  // "To Do", "In Progress", "Completed"
    private String priority;  // "Low", "Medium", "High"
    private Long assignedUserId;  // user id sem fær þetta task

    // Getters and Setters
}

