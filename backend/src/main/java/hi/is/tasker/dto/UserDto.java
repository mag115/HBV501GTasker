package hi.is.tasker.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Setter
@Getter
@Accessors(chain = true)
public class UserDto {
    private Long id;
    private String username;
    private String email;  // Include if desired
    private String role;   // Include if desired

    // Constructors
    public UserDto() {}

    public UserDto(Long id, String username, String email, String role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }
}

