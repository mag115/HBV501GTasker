package hi.is.tasker.controllers;

import hi.is.tasker.dto.LoginResponse;
import hi.is.tasker.dto.LoginUserDto;
import hi.is.tasker.dto.RegisterUserDto;
import hi.is.tasker.entities.User;
import hi.is.tasker.services.AuthenticationService;
import hi.is.tasker.services.JwtService;
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

    @PostMapping("/signup")
    public ResponseEntity<LoginResponse> register(@RequestBody RegisterUserDto registerUserDto) {
        try {
            User registeredUser = authenticationService.signup(registerUserDto);

            String jwtToken = jwtService.generateToken(registeredUser);

            System.out.println(registeredUser.getId());

            LoginResponse loginResponse = new LoginResponse(
                    jwtToken,
                    jwtService.getExpirationTime(),
                    registeredUser.getRole(),
                    registeredUser.getId(),
                    registeredUser.getUsername()
            );
            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        try {


            User authenticatedUser = authenticationService.authenticate(loginUserDto);

            String jwtToken = jwtService.generateToken(authenticatedUser);

            LoginResponse loginResponse = new LoginResponse(
                    jwtToken,
                    jwtService.getExpirationTime(),
                    authenticatedUser.getRole(),
                    authenticatedUser.getId(),
                    authenticatedUser.getUsername());


            System.out.println("userID : " + authenticatedUser.getId());

            return ResponseEntity.ok(loginResponse);
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}
