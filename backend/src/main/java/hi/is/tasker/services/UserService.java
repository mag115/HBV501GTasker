package hi.is.tasker.services;

import hi.is.tasker.entities.Role;
import hi.is.tasker.entities.User;
import hi.is.tasker.repositories.UserRepository;
import java.util.List;
import java.util.List;
import java.util.Optional;


public interface UserService {
    User createUser(User user);
    Optional<User> getUserByUsername(String username);
    Optional<User> getUserByEmail(String email);
    Optional<User> getUserById(Long id);
    void deleteUser(Long id);
    void updateUserRole(Long userId, Role newRole);
}