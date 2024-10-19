package hi.is.tasker.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
public class LoginResponse {
    private String token;
    private long expiresIn;
    private String role;  // Add role to the login response

    public LoginResponse(String token, long expiresIn, String role) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.role = role;  // Convert enum to string
    }

    // Getter for token
    public String getToken() {
        return token;
    }

    // Setter for token
    public void setToken(String token) {
        this.token = token;
    }

    // Getter for expiresIn
    public long getExpiresIn() {
        return expiresIn;
    }

    // Setter for expiresIn
    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    // Getter for role
    public String getRole() {
        return role;
    }

    // Setter for role (in case you need to change role later)
    public void setRole(String role) {
        this.role = role;  // Convert enum to string
    }
}
