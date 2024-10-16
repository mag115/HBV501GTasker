package hi.is.tasker.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

public class LoginUserDto {
    private String password;
    private String username;

    // Getters and setters

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
