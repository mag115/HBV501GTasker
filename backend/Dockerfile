# Use an OpenJDK base image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the entire project to the container
COPY . .

# Ensure the Gradle wrapper has execute permissions
RUN chmod +x ./gradlew

# Build the application
RUN ./gradlew build -x test

# Expose the port that the Spring Boot app uses
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "build/libs/Tasker-0.0.1-SNAPSHOT.jar"]
