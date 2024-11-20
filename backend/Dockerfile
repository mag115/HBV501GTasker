# Use an OpenJDK base image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the Gradle wrapper and project files into the container
COPY gradlew .
COPY gradle ./gradle
COPY . .

# Build the application using the Gradle wrapper
RUN ./gradlew build -x test

# Expose the port that the Spring Boot application runs on
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "build/libs/Tasker-0.0.1-SNAPSHOT.jar"]
