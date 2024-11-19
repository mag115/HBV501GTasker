package hi.is.tasker.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity(name = "time_tracking")
public class TimeTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "time_tracking_seq")
    @SequenceGenerator(name = "time_tracking_seq", sequenceName = "time_tracking_sequence", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task; //tengja við task entity

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private double timeSpent;
}
