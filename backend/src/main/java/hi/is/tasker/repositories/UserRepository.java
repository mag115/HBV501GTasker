package hi.is.tasker.repositories;

import hi.is.tasker.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByFullName(String fullName);
    Optional<User> findByEmail(String email);

    Optional<User> findById(Long id);
}
