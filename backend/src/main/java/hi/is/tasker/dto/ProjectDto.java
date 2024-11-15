package hi.is.tasker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.List;

@Getter
@Setter
@Accessors(chain = true)
public class ProjectDto {
    @NotBlank(message = "Project name is required")
    private String name;

    private String description;

    private List<Long> userIds; // Add this field
}
