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

@RestController
@RequestMapping("/auth")
public class LoginController {

    private static final Logger LOG = LoggerFactory.getLogger(LoginController.class);

    @Autowired
    protected AuthenticationService authenticationService;

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(@RequestParam String email) {
        Map<String, Object> response = new HashMap<>();
        Optional<User> userOptional = authenticationService.findUserByEmail(email);
        if (userOptional.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        User user = userOptional.get();
        response.put("success", true);
        response.put("userId", user.getId());
        response.put("email", user.getUsername());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("role", user.getRole());
        response.put("phone", user.getPhone());
        response.put("streetAddress", user.getStreetAddress());
        response.put("city", user.getCity());
        response.put("state", user.getState());
        response.put("zipCode", user.getZipCode());
        response.put("birthDate", user.getBirthDate() != null ? user.getBirthDate().toString() : null);
        return ResponseEntity.ok(response);
    }

    /**
     * Test endpoint for checking login endpoint availability.
     */
    @GetMapping("/login")
    public String login() {
        LOG.info("GET /auth/login endpoint called");
        return "Testing login endpoint! Hello class!";
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> handleLogin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || email.trim().isEmpty() || password == null || password.isEmpty()) {
            LOG.warn("Login attempt with missing credentials");
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Email and password are required");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        LOG.info("POST /auth/login endpoint called with email: {}", email);

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
                response.put("status", user.getStatus()); // Include status in response
                response.put("phone", user.getPhone());
                response.put("streetAddress", user.getStreetAddress());
                response.put("city", user.getCity());
                response.put("state", user.getState());
                response.put("zipCode", user.getZipCode());
                response.put("birthDate", user.getBirthDate() != null ? user.getBirthDate().toString() : null);
                LOG.info("User authenticated successfully: {}", email);
                return ResponseEntity.ok(response);
            }
        }

        response.put("message", "Invalid email or password");
        response.put("success", false);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> handleRegister(@RequestBody Map<String, Object> userData) {
        String email = (String) userData.get("email");
        String password = (String) userData.get("password");
        String firstName = (String) userData.get("firstName");
        String lastName = (String) userData.get("lastName");
        String birthDateStr = (String) userData.get("birthDate");
        String ssn = (String) userData.get("ssn");
        String middleName = (String) userData.get("middleName");
        String phone = (String) userData.get("phone");
        String roleStr = (String) userData.get("role");
        String streetAddress = (String) userData.get("streetAddress");
        String city = (String) userData.get("city");
        String state = (String) userData.get("state");
        String zipCode = (String) userData.get("zipCode");

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
            LocalDate birthDate = null;
            if (birthDateStr != null && !birthDateStr.trim().isEmpty()) {
                birthDate = LocalDate.parse(birthDateStr);
            }

            User.UserRole role = User.UserRole.Applicant;
            if (roleStr != null && !roleStr.trim().isEmpty()) {
                try {
                    role = User.UserRole.valueOf(roleStr);
                } catch (IllegalArgumentException e) {
                    LOG.warn("Invalid role provided: {}, defaulting to Applicant", roleStr);
                }
            }

            User user = authenticationService.registerUser(
                email, password, firstName, middleName, lastName,
                birthDate, ssn, phone, streetAddress, city, state, zipCode, role
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
        } catch (Exception e) {
            LOG.error("Unexpected error during registration", e);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registration failed: " + e.getMessage());
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}