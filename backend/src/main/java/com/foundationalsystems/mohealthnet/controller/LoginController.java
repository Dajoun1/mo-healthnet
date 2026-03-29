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
     * Handles POST requests to /auth/register for user registration (minimal signup).
     * Uses progressive profiling: collects only email, password, first name, last name.
     * SSN and birth date collected later via /auth/complete-profile.
     *
     * @param userData a map containing registration fields (email, password, firstName, lastName)
     * @return a response with registration status
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> handleRegister(@RequestBody Map<String, Object> userData) {
        // Extract required fields for minimal signup
        String email = (String) userData.get("email");
        String password = (String) userData.get("password");
        String firstName = (String) userData.get("firstName");
        String lastName = (String) userData.get("lastName");

        // Optional role (defaults to Applicant)
        String roleStr = (String) userData.get("role");

        // Validate required fields
        if (email == null || email.trim().isEmpty() ||
            password == null || password.isEmpty() ||
            firstName == null || firstName.trim().isEmpty() ||
            lastName == null || lastName.trim().isEmpty()) {

            LOG.warn("Registration attempt with missing required fields");
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Email, password, firstName, and lastName are required");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        try {
            // Parse role (default to Applicant)
            User.UserRole role = User.UserRole.Applicant;
            if (roleStr != null && !roleStr.trim().isEmpty()) {
                try {
                    role = User.UserRole.valueOf(roleStr);
                } catch (IllegalArgumentException e) {
                    LOG.warn("Invalid role provided: {}, defaulting to Applicant", roleStr);
                }
            }

            // Register user with minimal information
            User user = authenticationService.registerUserMinimal(
                email, password, firstName, lastName, role
            );

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Account created successfully! Please complete your profile.");
            response.put("success", true);
            response.put("userId", user.getId());
            response.put("email", user.getUsername());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("profileComplete", user.getProfileComplete());
            LOG.info("User registered successfully (minimal info): {}", email);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            LOG.warn("Registration failed: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } catch (Exception e) {
            LOG.error("Unexpected error during registration", e);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registration failed: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Handles POST requests to /auth/complete-profile for completing user profile.
     * Requires authentication (user must be logged in).
     * Collects SSN, birth date, and phone number.
     *
     * @param email the user's email (passed from authenticated request)
     * @param profileData a map containing SSN, birthDate, phone
     * @return a response with profile completion status
     */
    @PostMapping("/complete-profile")
    public ResponseEntity<Map<String, Object>> handleCompleteProfile(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestBody Map<String, Object> profileData) {

        // Extract fields
        String birthDateStr = (String) profileData.get("birthDate"); // Format: YYYY-MM-DD
        String ssn = (String) profileData.get("ssn");
        String phone = (String) profileData.get("phone");

        // Validate required fields
        if (birthDateStr == null || birthDateStr.trim().isEmpty() ||
            ssn == null || ssn.trim().isEmpty()) {

            LOG.warn("Profile completion attempt with missing required fields");
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Birth date and SSN are required");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        try {
            // Parse birth date
            LocalDate birthDate = LocalDate.parse(birthDateStr);

            // Get email from request (for now, from header; in production use security context)
            // This should be extracted from the authenticated user in real implementation
            String userEmail = email;
            if (userEmail == null || userEmail.trim().isEmpty()) {
                userEmail = (String) profileData.get("email");
            }

            if (userEmail == null || userEmail.trim().isEmpty()) {
                LOG.warn("Profile completion: user email not provided");
                Map<String, Object> response = new HashMap<>();
                response.put("message", "User not authenticated");
                response.put("success", false);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // Complete user profile
            User user = authenticationService.completeUserProfile(
                userEmail, birthDate, ssn, phone
            );

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile completed successfully");
            response.put("success", true);
            response.put("userId", user.getId());
            response.put("email", user.getUsername());
            response.put("profileComplete", user.getProfileComplete());
            LOG.info("User profile completed: {}", userEmail);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            LOG.warn("Profile completion failed: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            LOG.error("Unexpected error during profile completion", e);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile completion failed: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}

