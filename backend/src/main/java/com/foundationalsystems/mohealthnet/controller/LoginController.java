package com.foundationalsystems.mohealthnet.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * REST controller that handles login-related HTTP requests for the MoHealthNet application.
 */
@RestController
public class LoginController {

    private static final Logger LOG = LoggerFactory.getLogger(LoginController.class);

    /**
     * Handles POST requests to /auth/login for user authentication.
     *
     * @param credentials a map containing email and password
     * @return a response message stating that the request was received
     */
    @PostMapping("/auth/login")
    public Map<String, String> handleLogin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        LOG.info("POST /auth/login endpoint called with email: {}", email);
        LOG.info("Password received: {}", password != null ? "Yes (length: " + password.length() + ")" : "No");

        // Test Response - We will validate the credentials in future sprints
        Map<String, String> response = new HashMap<>();
        response.put("message", "Login request received successfully");
        response.put("email", email);
        response.put("status", "testing");
        return response;
    }
}

