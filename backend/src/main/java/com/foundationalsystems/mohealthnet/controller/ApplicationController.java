package com.foundationalsystems.mohealthnet.controller;

import com.foundationalsystems.mohealthnet.entity.Application;
import com.foundationalsystems.mohealthnet.entity.User;
import com.foundationalsystems.mohealthnet.repository.UserRepository;
import com.foundationalsystems.mohealthnet.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private static final Logger LOG = LoggerFactory.getLogger(ApplicationController.class);

    @Autowired
    private ApplicationService applicationService;

    /**
     * Submit a new application.
    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitApplication(@RequestBody Map<String, Object> payload) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Resolve userId — accept direct id or fall back to email lookup
            Object userIdObj = payload.get("userId");
            Integer userId = null;

            if (userIdObj != null) {
                userId = Integer.parseInt(userIdObj.toString());
            } else {
                String email = (String) payload.get("userEmail");
                if (email != null && !email.isBlank()) {
                    Optional<User> userOpt = userRepository.findByUsername(email);
                    if (userOpt.isPresent()) {
                        userId = userOpt.get().getId();
                    }
                }
            }

            if (userId == null) {
                response.put("success", false);
                response.put("message", "Could not identify user. Please log out and log back in.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> activities = (List<Map<String, Object>>) payload.get("activities");
            if (activities == null || activities.isEmpty()) {
                response.put("success", false);
                response.put("message", "At least one activity is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            Application application = applicationService.submitApplication(userId, payload, activities);

            response.put("success", true);
            response.put("message", "Application submitted successfully");
            response.put("applicationId", application.getId());
            response.put("status", application.getStatus());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            LOG.error("Error submitting application", e);
            response.put("success", false);
            response.put("message", "Submission failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get all applications for a user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserApplications(@PathVariable Integer userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Application> applications = applicationService.getUserApplications(userId);
            response.put("success", true);
            response.put("applications", applications);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            LOG.error("Error fetching applications for user: {}", userId, e);
            response.put("success", false);
            response.put("message", "Failed to fetch applications");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}



