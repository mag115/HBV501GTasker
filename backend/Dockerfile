# Use an OpenJDK base image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy Gradle wrapper and project files
COPY gradlew .
COPY . .

# Give execute permissions to the Gradle wrapper
RUN chmod +x ./gradlew

# Build the application
RUN ./gradlew build -x test

# Expose the port that the Spring Boot app will use
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "build/libs/<your-jar-name>.jar"]
