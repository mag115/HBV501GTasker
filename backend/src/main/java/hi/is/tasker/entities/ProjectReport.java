package hi.is.tasker.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "project_reports")
public class ProjectReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany
    @JoinColumn(name = "task_id")
    private List<Task> tasks; // Summary á tasks

    @Column(nullable = false)
    private LocalDateTime reportDate;

    private long totalTimeSpent; // Summary tíma

    private String overallPerformance; // "On Track" or "Behind Schedule"

    // Default constructor
    public ProjectReport() {
    }

    public ProjectReport(List<Task> tasks, long totalTimeSpent, String overallPerformance) {
        this.tasks = tasks;
        this.totalTimeSpent = totalTimeSpent;
        this.overallPerformance = overallPerformance;
        this.reportDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    public LocalDateTime getReportDate() {
        return reportDate;
    }

    public void setReportDate(LocalDateTime reportDate) {
        this.reportDate = reportDate;
    }

    public long getTotalTimeSpent() {
        return totalTimeSpent;
    }

    public void setTotalTimeSpent(long totalTimeSpent) {
        this.totalTimeSpent = totalTimeSpent;
    }

    public String getOverallPerformance() {
        return overallPerformance;
    }

    public void setOverallPerformance(String overallPerformance) {
        this.overallPerformance = overallPerformance;
    }
}