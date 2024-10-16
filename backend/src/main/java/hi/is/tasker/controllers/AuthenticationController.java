package hi.is.tasker.controllers;

import hi.is.tasker.dto.LoginUserDto;
import hi.is.tasker.dto.RegisterUserDto;
import hi.is.tasker.dto.LoginResponse;
import hi.is.tasker.entities.User;
import hi.is.tasker.services.AuthenticationService;
import hi.is.tasker.services.JwtService;
import hi.is.tasker.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    // Register (Sign Up)
    @PostMapping("/signup")
    public ResponseEntity<LoginResponse> register(@RequestBody RegisterUserDto registerUserDto) {
        // Register the user (role is included in RegisterUserDto)
        User registeredUser = authenticationService.signup(registerUserDto);

        // Generate JWT token
        String jwtToken = jwtService.generateToken(registeredUser);

        // Use constructor with 3 arguments (token, expiresIn, role) for LoginResponse
        LoginResponse loginResponse = new LoginResponse(
                jwtToken,                              // JWT token
                jwtService.getExpirationTime(),         // Expiration time
                registeredUser.getRole()                // User role as enum
        );

        return ResponseEntity.ok(loginResponse);
    }

    // Login (Authenticate)
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        // Authenticate the user
        User authenticatedUser = authenticationService.authenticate(loginUserDto);

        // Generate JWT token
        String jwtToken = jwtService.generateToken(authenticatedUser);

        // Use constructor with 3 arguments (token, expiresIn, role) for LoginResponse
        LoginResponse loginResponse = new LoginResponse(
                jwtToken,                              // JWT token
                jwtService.getExpirationTime(),         // Expiration time
                authenticatedUser.getRole()             // User role as enum
        );

        return ResponseEntity.ok(loginResponse);
    }
}
