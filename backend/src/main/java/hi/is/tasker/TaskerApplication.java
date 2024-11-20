package hi.is.tasker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class TaskerApplication {
    public static void main(String[] args) {
        SpringApplication.run(TaskerApplication.class, args);
    }
}

