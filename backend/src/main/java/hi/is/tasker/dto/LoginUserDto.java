package hi.is.tasker.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

public class LoginUserDto {
    private String email;  // Make sure this is 'email' and not 'username'
    private String password;
    private String username;

    // Getters and setters
    public String getEmail() {
        return email;
    }

    public LoginUserDto setEmail(String email) {
        this.email = email;
        return this;
    }

    public String getUsername() {return username;}
    public LoginUserDto setUsername(String username) {
        this.username = username;
        return this;
    }
    public String getPassword() {
        return password;
    }

    public LoginUserDto setPassword(String password) {
        this.password = password;
        return this;
    }
}
