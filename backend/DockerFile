# Use an OpenJDK base image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the Gradle wrapper and project files
COPY . .

# Build the application
RUN ./gradlew build

# Expose the port that your Spring Boot app runs on
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "/build/libs/Tasker-0.0.1-SNAPSHOT.jar"]