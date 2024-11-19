# Use an OpenJDK base image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy only the built JAR file to the container
COPY build/libs/Tasker-0.0.1-SNAPSHOT.jar Tasker-0.0.1-SNAPSHOT.jar

# Expose the port that the Spring Boot app uses
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "Tasker-0.0.1-SNAPSHOT.jar"]
