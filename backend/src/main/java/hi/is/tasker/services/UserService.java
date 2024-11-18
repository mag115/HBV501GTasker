package hi.is.tasker.services;

import hi.is.tasker.dto.UserDto;
import hi.is.tasker.entities.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    List<User> findAll();
    User save(User user);
    Optional<User> getUserByUsername(String username);
    Optional<User> getUserByEmail(String email);
    Optional<User> getUserById(Long id);
    void deleteUser(Long id);
    List<User> getAllUsers();         // Original method
    List<UserDto> getAllUsersDTO();
    User updateUserRole(Long id, String role);  // New method for updating the role
}
