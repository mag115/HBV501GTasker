# Use an OpenJDK base image
FROM openjdk:17-jdk-slim

# Copy the built JAR file directly to the container
COPY build/libs/Tasker-0.0.1-SNAPSHOT.jar /Tasker-0.0.1-SNAPSHOT.jar

# Expose the port that the Spring Boot app uses
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "/Tasker-0.0.1-SNAPSHOT.jar"]
