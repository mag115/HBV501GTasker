# Use an OpenJDK base image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy Gradle wrapper and project files
COPY gradlew .
COPY gradle ./gradle
COPY . .

RUN ./gradlew build -x test
# Expose the port that the Spring Boot app uses
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "build/libs/Tasker-0.0.1-SNAPSHOT.jar"]

