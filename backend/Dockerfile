# Stage 1: Build the application
FROM gradle:7.6-jdk17 AS builder

# Set working directory
WORKDIR /app

# Copy Gradle wrapper and project files into the container
COPY gradlew gradlew
COPY gradle gradle
COPY build.gradle.kts build.gradle.kts
COPY settings.gradle.kts settings.gradle.kts
COPY src src

# Run the build command
RUN ./gradlew build -x test

# Stage 2: Run the application
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /app/build/libs/Tasker-0.0.1-SNAPSHOT.jar Tasker-0.0.1-SNAPSHOT.jar

# Expose the port that the application runs on
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "Tasker-0.0.1-SNAPSHOT.jar"]
