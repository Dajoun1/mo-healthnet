package com.foundationalsystems.mohealthnet.controller;

import com.foundationalsystems.mohealthnet.service.AuthenticationService;
import com.foundationalsystems.mohealthnet.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * REST controller that handles login and authentication-related HTTP requests for the Employment App.
 * Uses bcrypt for secure password hashing and verification.
 * Portal login uses email + password (no username required).
 */
@RestController
@RequestMapping("/auth")
public class LoginController {

    private static final Logger LOG = LoggerFactory.getLogger(LoginController.class);

    @Autowired
    protected AuthenticationService authenticationService;

    /**
     * Test endpoint for checking login endpoint availability.
     */
    @GetMapping("/login")
    public String login() {
        LOG.info("GET /auth/login endpoint called");
        return "Testing login endpoint! Hello class!";
    }

    /**
     * Handles POST requests to /auth/login for user authentication.
     * Portal login uses email and password.
     *
     * @param credentials a map containing email and password
     * @return a response with authentication status and user information (on success)
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> handleLogin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        // Validate input
        if (email == null || email.trim().isEmpty() || password == null || password.isEmpty()) {
            LOG.warn("Login attempt with missing credentials");
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Email and password are required");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        LOG.info("POST /auth/login endpoint called with email: {}", email);

        // Authenticate user with bcrypt password verification
        boolean isAuthenticated = authenticationService.authenticateUser(email, password);

        Map<String, Object> response = new HashMap<>();

        if (isAuthenticated) {
            Optional<User> userOptional = authenticationService.findUserByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                response.put("message", "Authentication successful");
                response.put("success", true);
                response.put("userId", user.getId());
                response.put("email", user.getUsername());
                response.put("firstName", user.getFirstName());
                response.put("lastName", user.getLastName());
                response.put("role", user.getRole());
                LOG.info("User authenticated successfully: {}", email);
                return ResponseEntity.ok(response);
            }
        }

        response.put("message", "Invalid email or password");
        response.put("success", false);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    /**
     * Handles POST requests to /auth/register for user registration.
     * Hashes the password using bcrypt before storing in the database.
     * Email serves as the username for portal login.
     *
     * @param userData a map containing registration fields
     * @return a response with registration status
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> handleRegister(@RequestBody Map<String, Object> userData) {
        // Extract and validate required fields
        String email = (String) userData.get("email");
        String password = (String) userData.get("password");
        String firstName = (String) userData.get("firstName");
        String lastName = (String) userData.get("lastName");
        String birthDateStr = (String) userData.get("birthDate"); // Format: YYYY-MM-DD
        String ssn = (String) userData.get("ssn");

        // Optional fields
        String middleName = (String) userData.get("middleName");
        String phone = (String) userData.get("phone");
        String roleStr = (String) userData.get("role");

        // Validate required fields
        if (email == null || email.trim().isEmpty() ||
            password == null || password.isEmpty() ||
            firstName == null || firstName.trim().isEmpty() ||
            lastName == null || lastName.trim().isEmpty()) {

            LOG.warn("Registration attempt with missing required fields");
            Map<String, Object> response = new HashMap<>();
            response.put("message", "All required fields must be provided: email, password, firstName, lastName");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        try {
            // Parse birth date only if provided
            LocalDate birthDate = null;
            if (birthDateStr != null && !birthDateStr.trim().isEmpty()) {
                birthDate = LocalDate.parse(birthDateStr);
            }
            // Parse role (default to Applicant)
            User.UserRole role = User.UserRole.Applicant;
            if (roleStr != null && !roleStr.trim().isEmpty()) {
                try {
                    role = User.UserRole.valueOf(roleStr);
                } catch (IllegalArgumentException e) {
                    LOG.warn("Invalid role provided: {}, defaulting to Applicant", roleStr);
                }
            }

            // Email serves as username
            User user = authenticationService.registerUser(
                email, password, firstName, middleName, lastName,
                birthDate, ssn, phone, role
            );

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("success", true);
            response.put("userId", user.getId());
            response.put("email", user.getUsername());
            LOG.info("User registered successfully: {}", email);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            LOG.warn("Registration failed: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } catch (IllegalStateException e) {
            LOG.warn("Invalid date format: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Birth date must be in YYYY-MM-DD format");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            LOG.error("Unexpected error during registration", e);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registration failed: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}

