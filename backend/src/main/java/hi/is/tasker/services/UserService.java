package hi.is.tasker.services;

import hi.is.tasker.entities.User;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    Optional<User> getUserByUsername(String username);
    Optional<User> getUserByEmail(String email);
    Optional<User> getUserById(Long id);
    void deleteUser(Long id);
    User updateUserRole(Long id, String role);  // New method for updating the role
}
