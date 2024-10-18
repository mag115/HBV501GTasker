package hi.is.tasker.dto;

import hi.is.tasker.entities.Role;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
public class LoginResponse {
    private String token;
    private long expiresIn;
    private Role role;  // Add role to the login response

    public String getToken() {
        return token;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public Role getRole() {  // Added getter for role
        return role;
    }
}
