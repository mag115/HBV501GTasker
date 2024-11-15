package hi.is.tasker.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity(name = "project")
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Owner of the project
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnoreProperties({"ownedProjects", "tasks", "assignedTasks"})
    private User owner;

    // Team members (Many-to-Many relationship)
    @ManyToMany
    @JoinTable(
            name = "project_members",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )

    @JsonIgnoreProperties({"projects", "ownedProjects", "tasks", "assignedTasks"})
    private List<User> members = new ArrayList<>();

    // Tasks associated with this project
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"project", "assignedUser"})
    private List<Task> tasks;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
