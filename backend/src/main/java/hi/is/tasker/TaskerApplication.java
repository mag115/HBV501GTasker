package hi.is.tasker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class TaskerApplication {
    public static void main(String[] args) {
        // Try to load the .env file, and fallback to system environment variables if not found
        Dotenv dotenv;
        try {
            dotenv = Dotenv.load();
        } catch (Exception e) {
            System.out.println("Could not load .env file, falling back to system environment variables.");
            dotenv = Dotenv.configure().ignoreIfMissing().load();
        }

        // Example usage
        String dbHost = dotenv.get("DB_HOST", System.getenv("DB_HOST"));
        System.out.println("Database Host: " + dbHost);

        SpringApplication.run(TaskerApplication.class, args);
    }
}
