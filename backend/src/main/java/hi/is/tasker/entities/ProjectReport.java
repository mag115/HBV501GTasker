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

    public ProjectReport() {}

    public ProjectReport(List<Task> tasks, long totalTimeSpent, String overallPerformance) {
        this.tasks = tasks;
        this.totalTimeSpent = totalTimeSpent;
        this.overallPerformance = overallPerformance;
        this.reportDate = LocalDateTime.now();
    }

    // Getters and Setters
}