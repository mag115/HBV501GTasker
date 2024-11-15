package hi.is.tasker.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Getter
@Setter
@Entity(name = "task")
@Table(name = "tasks")
public class
Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDateTime deadline;
    private Boolean reminderSent;
    private Double estimatedDuration;  // in hours
    private Integer estimatedWeeks;    // in weeks if applicable
    private Double effortPercentage;   // percentage of total time until deadline if applicable
    private String progressStatus;     // "On Track", "Behind Schedule", or "Completed"
    private Long dependency;
    private Double progress;
    private Double manualProgress;//ATH: geymir hvað user setur progress sem

    // New fields:
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    @JsonIgnoreProperties({"tasks"})  // Avoids potential circular reference issues.
    private User assignedUser;

    private String status;  // Example values: "To Do", "In Progress", "Completed"
    private String priority;  // Example values: "Low", "Medium", "High"
    private String project_name;
    private String project_id;
    private double timeSpent;
    private double elapsedTime;
    private Double scheduledProgress;

    @OneToMany(mappedBy = "task", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<TimeTracking> timeTrackings;


    public void calculateActualProgress() {
        if (estimatedDuration != null && estimatedDuration > 0) {
            this.progress = Math.min((timeSpent / (estimatedDuration * 3600)) * 100, 100); // Cap at 100%
        } else {
            this.progress = 0.0;
        }
    }

    public Double calculateScheduledProgress() {
        if (deadline != null) {
            long totalDuration = ChronoUnit.SECONDS.between(LocalDateTime.now(), deadline);
            long timeSinceStart = estimatedDuration != null ? (long) (estimatedDuration * 3600) : totalDuration;

            long elapsedSeconds = ChronoUnit.SECONDS.between(LocalDateTime.now().minusSeconds(timeSinceStart), LocalDateTime.now());

            return Math.min(((double) elapsedSeconds / totalDuration) * 100, 100);
        }
        return 0.0;
    }

    public void calculateScheduledProgressStatus() {
        if (deadline != null) {
            double scheduledProgress = calculateScheduledProgress();
            double actualProgress = progress != null ? progress : 0.0;

            if (actualProgress >= 100) {
                this.progressStatus = "Completed";
            } else if (actualProgress >= scheduledProgress) {
                this.progressStatus = "On Track";
            } else {
                this.progressStatus = "Behind Schedule";
            }
        } else {
            this.progressStatus = "On Track";
        }
    }

    public void updateProgressStatus() {
        if (deadline != null) {
            double scheduledProgress = calculateScheduledProgress();
            double actualProgress = progress != null ? progress : 0.0;

            if (actualProgress >= scheduledProgress) {
                this.progressStatus = "On Track";
            } else {
                this.progressStatus = "Behind Schedule";
            }
        } else {
            this.progressStatus = "On Track";
        }
    }

    public void setManualProgress(Double manualProgress) {
        this.manualProgress = manualProgress;
    }

    public Double getManualProgress() {
        return manualProgress;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getTimeSpent() {
        return timeSpent;
    }

    public void setTimeSpent(double timeSpent) {
        this.timeSpent = timeSpent;
    }

    public double getElapsedTime() {
        return elapsedTime;
    }

    public void setElapsedTime(double elapsedTimes) {
        this.elapsedTime = elapsedTime;
    }


    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public Double getEstimatedDuration() {
        return estimatedDuration;
    }

    public void setEstimatedDuration(Double estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }

    public String getProgressStatus() {
        return progressStatus;
    }

    public void setProgressStatus(String progressStatus) {
        this.progressStatus = progressStatus;
    }

    public Integer getEstimatedWeeks() {
        return estimatedWeeks;
    }

    public void setEstimatedWeeks(Integer estimatedWeeks) {
        this.estimatedWeeks = estimatedWeeks;
    }

    public Double getEffortPercentage() {
        return effortPercentage;
    }

    public void setEffortPercentage(Double effortPercentage) {
        this.effortPercentage = effortPercentage;
    }

    public void setAssignedUser(User user) {
        this.assignedUser = user;
    }

    public void setDependency(Long taskId) {
        this.dependency = taskId;
    }
}
