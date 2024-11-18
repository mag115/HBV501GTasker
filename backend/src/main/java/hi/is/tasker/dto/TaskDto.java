package hi.is.tasker.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

@Getter
@Setter
@Accessors(chain = true)
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

    // No-args constructor
    public TaskDto() {}
}

