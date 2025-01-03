package hi.is.tasker.services;

import hi.is.tasker.dto.LoginUserDto;
import hi.is.tasker.dto.RegisterUserDto;
import hi.is.tasker.entities.User;
import hi.is.tasker.repositories.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Sign up a new user
    public User signup(RegisterUserDto input) {
        System.out.println("trying to signup user");
        String defaultRole = (input.getRole() != null && !input.getRole().isEmpty())
                ? input.getRole()
                : "TEAM_MEMBER";  // Set default role to TEAM_MEMBER if not provided


        User newUser = new User();
        newUser.setEmail(input.getEmail());
        newUser.setUsername(input.getUsername());
        newUser.setPassword(passwordEncoder.encode(input.getPassword()));
        newUser.setRole(defaultRole);
        try {
            return userRepository.save(newUser);
        } catch (DataIntegrityViolationException ex) {
           throw (ex);
        }


    }

    // Authenticate an existing user
    public User authenticate(LoginUserDto input) {
        System.out.println("Username received: " + input.getUsername());
        System.out.println("Password received: " + input.getPassword());

        if (input.getUsername() == null || input.getUsername().isEmpty()) {
            throw new RuntimeException("Username is required");
        }
        if (input.getPassword() == null || input.getPassword().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        //Authenticate using the AuthenticationManager
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            input.getUsername(),
                            input.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new RuntimeException("Invalid credentials");
        }
        // Find the user and return it (role is stored as a string in User entity)
        return userRepository.findByUsername(input.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
