package hi.is.tasker.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "project_reports")
public class ProjectReport {

    // Getters and Setters
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "project_report_seq")
    @SequenceGenerator(name = "project_report_seq", sequenceName = "project_report_sequence", allocationSize = 1)
    private Long id;

    @OneToMany
    @JoinColumn(name = "task_id")
    private List<Task> tasks; // Summary á tasks

    @Column(nullable = false)
    private LocalDateTime reportDate;

    private String overallPerformance;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id")
    private Project project;

    public ProjectReport() {
    }

    public ProjectReport(List<Task> tasks, String overallPerformance) {
        this.tasks = tasks;
        this.overallPerformance = overallPerformance;
        this.reportDate = LocalDateTime.now();
    }

}
