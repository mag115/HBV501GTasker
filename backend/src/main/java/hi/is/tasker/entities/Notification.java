package hi.is.tasker.entities;

package hi.is.tasker.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    // Getters and Setters
}