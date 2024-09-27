package hi.is.tasker.services;

import hi.is.tasker.entities.User;
import java.util.List;

public interface UserService {
    User createUser(User user);
    Optional<User> getUserByUsername(String username);
    Optional<User> getUserByEmail(String email);
    Optional<User> getUserById(Long id);
    void deleteUser(Long id);
}