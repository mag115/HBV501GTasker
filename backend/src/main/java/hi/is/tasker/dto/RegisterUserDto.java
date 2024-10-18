package hi.is.tasker.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import hi.is.tasker.entities.Role;  // Import the Role enum

@Getter
@Setter
@Accessors(chain = true)
public class RegisterUserDto {
    private String email;
    private String password;
    private String username;
    private Role role;  // Add role to the registration DTO
}
