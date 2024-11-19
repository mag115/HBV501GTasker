package hi.is.tasker.entities;

import jakarta.persistence.*;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;



@Getter
@Setter
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "notification_seq")
    @SequenceGenerator(name = "notification_seq", sequenceName = "notification_sequence", allocationSize = 1)
    private Long id;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private boolean isRead;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User recipient;

    private LocalDateTime timestamp;

    public Notification() {}

    public Notification(String message, User recipient) {
        this.message = message;
        this.recipient = recipient;
        this.isRead = false;
        this.timestamp = LocalDateTime.now();
    }

}