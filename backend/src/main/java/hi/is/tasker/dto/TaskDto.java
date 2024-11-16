package hi.is.tasker.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TaskDto {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime deadline;
    private String status;
    private String priority;
    private Double progress;
    private String progressStatus;
    private Double manualProgress;

    private Long assignedUserId;
    private String assignedUserName;

    private Long projectId;

    // Constructors
    public TaskDto() {}

    // Getters and setters
    // Include getters and setters for all fields
}
