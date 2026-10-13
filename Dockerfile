# Stage 1: Build the Maven application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and source files
COPY pom.xml .
COPY src ./src

# Package the application (skipping tests for fast container builds)
RUN mvn clean package -DskipTests

# Stage 2: Lightweight Alpine JRE Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Render dynamic port support
ENV PORT=8080
EXPOSE 8080

# Run Spring Boot with the assigned Render port
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
