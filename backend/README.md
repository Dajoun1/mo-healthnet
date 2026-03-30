# MO HealthNet Backend - Spring Boot API

## Project Overview

**MO HealthNet** is a Missouri Medicaid Employment Verification System designed to streamline the process of verifying employment information for Medicaid applicants. This repository contains the **backend/API** component of the application.


## Tech Stack

- **Framework:** Spring Boot 4.0.3
- **Language:** Java 25
- **Build Tool:** Maven
- **Dependency Management:** Spring Boot Starter Parent
- **Web Server:** Embedded Tomcat
- **Database:** MySQL (planned for future integration)
- **Testing:** JUnit 5, AssertJ
- **REST:** Spring Web MVC

## Installation

### Prerequisites

- **Java Development Kit (JDK)** - Version 25 or higher
  - [Download from Oracle](https://www.oracle.com/java/technologies/downloads/) 
- **Maven** - Version 3.6.0 or higher
  - [Download from Apache Maven](https://maven.apache.org/)
  
- **Git** - For version control

### Setup Steps

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd mo-healthnet/backend
   ```

2. **Build the project:**
   ```bash
   mvn clean install
   ```

3. **Start the Spring Boot application:**
   ```bash
   mvn spring-boot:run
   ```

4. **Verify the server is running:**
   ```
   Tomcat started on port 8080 (http) with context path '/'
   ```

5. **Access the API:**
   - API Base URL: `http://localhost:8080`
   - Health Check: `http://localhost:8080/health` (if actuator is enabled)

## Available Maven Commands

### Build & Development

#### `mvn spring-boot:run`
Starts the Spring Boot application in development mode.
- Embedded Tomcat runs on port 8080
- Logs display in terminal

#### `mvn clean compile`
Compiles Java source files without running the application.
- Useful for checking for compilation errors
- Output goes to `target/classes`

#### `mvn test`
Runs all unit tests using JUnit 5.
- Executes tests in `src/test/java/`
- Shows test results summary
- Requires `test` scope dependencies

#### `mvn install`
Builds and installs the project in local Maven repository.
- Allows other projects to depend on this project
- Creates JAR in `target/` and copies to `~/.m2/repository/`

## Configuration

### Application Properties

**File:** `src/main/resources/application.properties`

```properties
spring.application.name=mohealthnet
```

**Common configurations to add:**

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/

# Logging
logging.level.root=INFO
logging.level.com.foundationalsystems.mohealthnet=DEBUG

# Database Configuration (when enabled)
# spring.datasource.url=jdbc:mysql://localhost:3306/mohealthnet
# spring.datasource.username=root
# spring.datasource.password=password
# spring.jpa.hibernate.ddl-auto=update
# spring.jpa.show-sql=true

```

### CORS Configuration

**File:** `src/main/java/com/foundationalsystems/mohealthnet/config/WebConfig.java`

The `WebConfig` class configures CORS to allow frontend requests:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

**Allowed Origins:**
- `http://localhost:5173` - Vite frontend dev server
- `http://localhost:3000` - Backup frontend port

## API Endpoints

### Authentication

#### Sign In
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response: 200 OK**
```json
{
  "message": "Login request received successfully",
  "email": "user@example.com",
  "status": "testing"
}
```

**Response: 400 Bad Request**
- Incorrect JSON format or missing required fields

**Current Status:** Endpoint receives and logs requests. Authentication logic to be implemented.

### Future Endpoints (Planned)

- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/user/current` - Get current user info
- `POST /api/employment/verify` - Submit employment verification
- `GET /api/application/status` - Get application status
- `PUT /api/user/profile` - Update user profile

## Controllers

### LoginController

**File:** `src/main/java/com/foundationalsystems/mohealthnet/controller/LoginController.java`

Handles authentication-related HTTP requests.

**Methods:**

1. **handleLogin(@RequestBody Map<String, String> credentials)**
   - Maps to: `POST /auth/login`
   - Parameter: JSON body with `email` and `password`
   - Response: Map with `message`, `email`, and `status`
   - Logs email and password length

## Testing

### Run All Tests
```bash
mvn test
```

### Test Structure

**File:** `src/test/java/com/foundationalsystems/mohealthnet/controller/LoginControllerTest.java`

Tests use:
- **JUnit 5** for test framework
- **AssertJ** for assertions
- **Direct unit tests** (no Spring context for performance)

## Development Workflow


## Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Web MVC Documentation](https://spring.io/guides/gs/serving-web-content/)
- [Spring Testing Documentation](https://spring.io/guides/gs/testing-web/)
- [Maven Documentation](https://maven.apache.org/guides/)
- [JUnit 5 Documentation](https://junit.org/junit5/docs/current/user-guide/)
- [Missouri Medicaid Information](https://dss.mo.gov/rhc/)

---

**Frontend Repository:** See `../frontend/` for React frontend setup and documentation.

