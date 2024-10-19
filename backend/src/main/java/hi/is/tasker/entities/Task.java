package hi.is.tasker.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity(name = "task")
public class
Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDateTime deadline;
    private Boolean reminderSent;

    // New fields:
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)  // Allows for the assignedUser to be null
    private User assignedUser;  // Reference to the User entity instead of a Long ID

    private String status;  // Example values: "To Do", "In Progress", "Completed"
    private String priority;  // Example values: "Low", "Medium", "High"


    // Getters and Setters (Lombok handles these)
}
