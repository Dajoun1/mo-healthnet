package com.foundationalsystems.mohealthnet.controller;

import com.foundationalsystems.mohealthnet.dto.UserSummary;
import com.foundationalsystems.mohealthnet.entity.User;
import com.foundationalsystems.mohealthnet.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
@RequestMapping("/api/admin")
public class AdminController {

    private static final Logger LOG = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<User> usersPage = adminService.getAllUsers(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("users", usersPage.getContent());
        response.put("currentPage", usersPage.getNumber());
        response.put("totalItems", usersPage.getTotalElements());
        response.put("totalPages", usersPage.getTotalPages());
        response.put("pageSize", usersPage.getSize());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/search")
    public ResponseEntity<Map<String, Object>> searchUsers(
            @RequestParam String term,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage = adminService.searchUsers(term, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("users", usersPage.getContent());
        response.put("currentPage", usersPage.getNumber());
        response.put("totalItems", usersPage.getTotalElements());
        response.put("totalPages", usersPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Integer userId) {
        Optional<User> userOptional = adminService.getUserById(userId);

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(userOptional.get());
    }

    @GetMapping("/users/role/{role}")
    public ResponseEntity<Map<String, Object>> getUsersByRole(
            @PathVariable User.UserRole role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<UserSummary> usersPage = adminService.getUsersByRole(role, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("users", usersPage.getContent());
        response.put("currentPage", usersPage.getNumber());
        response.put("totalItems", usersPage.getTotalElements());
        response.put("totalPages", usersPage.getTotalPages());
        response.put("pageSize", usersPage.getSize());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/status/{status}")
    public ResponseEntity<Map<String, Object>> getUsersByStatus(
            @PathVariable User.UserStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<UserSummary> usersPage = adminService.getUsersByStatus(status, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("users", usersPage.getContent());
        response.put("currentPage", usersPage.getNumber());
        response.put("totalItems", usersPage.getTotalElements());
        response.put("totalPages", usersPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/users")
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody Map<String, String> userData) {
        try {
            String email = userData.get("email");
            String firstName = userData.get("firstName");
            String lastName = userData.get("lastName");
            String middleName = userData.get("middleName");
            String roleStr = userData.get("role");

            // Validate required fields
            if (email == null || email.trim().isEmpty() ||
                firstName == null || firstName.trim().isEmpty() ||
                lastName == null || lastName.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "Email, first name, and last name are required");
                errorResponse.put("success", false);
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Parse role
            User.UserRole role = User.UserRole.Applicant; // Default
            if (roleStr != null && !roleStr.trim().isEmpty()) {
                try {
                    role = User.UserRole.valueOf(roleStr);
                } catch (IllegalArgumentException e) {
                    LOG.warn("Invalid role provided: {}, defaulting to Applicant", roleStr);
                }
            }

            User newUser = adminService.createUser(email, firstName, lastName, middleName, role);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User created successfully. Temporary password: TempPass123!");
            response.put("success", true);
            response.put("user", newUser);

            LOG.info("Admin created user: {} with role {}", email, role);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            LOG.warn("Failed to create user: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            // Only expose specific known validation errors
            if (e.getMessage() != null && e.getMessage().contains("Email already exists")) {
                errorResponse.put("message", "Email address is already registered");
            } else {
                errorResponse.put("message", "Unable to create user");
            }
            errorResponse.put("success", false);
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            LOG.error("Failed to create user: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Unable to create user");
            errorResponse.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<Map<String, Object>> updateUserRole(
            @PathVariable Integer userId,
            @RequestBody Map<String, String> request) {

        try {
            String roleStr = request.get("role");
            if (roleStr == null || roleStr.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "Role is required");
                errorResponse.put("success", false);
                return ResponseEntity.badRequest().body(errorResponse);
            }

            User updatedUser = adminService.updateUserRole(userId, roleStr);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User role updated successfully");
            response.put("success", true);
            response.put("user", updatedUser);

            LOG.info("Admin updated user role: User ID {} to {}", userId, roleStr);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            LOG.warn("Invalid role update attempt for user {}: {}", userId, e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Unable to update user role");
            errorResponse.put("success", false);
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            LOG.error("Failed to update user role for user {}: {}", userId, e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Unable to update user role");
            errorResponse.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Update user status
    @PutMapping("/users/{userId}/status")
    public ResponseEntity<Map<String, Object>> updateUserStatus(
            @PathVariable Integer userId,
            @RequestBody Map<String, String> request) {

        try {
            String statusStr = request.get("status");
            if (statusStr == null || statusStr.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "Status is required");
                errorResponse.put("success", false);
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Parse status - handle both capitalized and uppercase
            User.UserStatus newStatus;
            try {
                // Try direct match first (capitalized)
                newStatus = User.UserStatus.valueOf(statusStr);
            } catch (IllegalArgumentException e) {
                // Try capitalized version
                String capitalized = statusStr.substring(0, 1).toUpperCase() +
                                   statusStr.substring(1).toLowerCase();
                try {
                    newStatus = User.UserStatus.valueOf(capitalized);
                } catch (IllegalArgumentException ex) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("message", "Invalid status value");
                    errorResponse.put("success", false);
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            User updatedUser = adminService.updateUserStatus(userId, newStatus);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User status updated successfully");
            response.put("success", true);
            response.put("user", updatedUser);

            LOG.info("Admin updated user status: User ID {} to {}", userId, newStatus);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            LOG.warn("Invalid status update attempt: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Unable to update user status");
            errorResponse.put("success", false);
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            LOG.error("Failed to update user status for user {}: {}", userId, e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Unable to update user status");
            errorResponse.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Integer userId) {
        try {
            adminService.deleteUser(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User disabled successfully. User account is now inactive.");
            response.put("success", true);

            LOG.info("Admin disabled user: User ID {}", userId);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            LOG.warn("Failed to disable user {}: {}", userId, e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "User not found");
            errorResponse.put("success", false);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            LOG.error("Failed to disable user {}: {}", userId, e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Unable to disable user");
            errorResponse.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<Map<String, Object>> updateUserInfo(
            @PathVariable Integer userId,
            @RequestBody Map<String, String> userData) {

        try {
            String firstName = userData.get("firstName");
            String lastName = userData.get("lastName");
            String middleName = userData.get("middleName");
            String email = userData.get("email");

            User updatedUser = adminService.updateUserInfo(
                    userId, firstName, lastName, middleName, email);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User information updated successfully");
            response.put("success", true);
            response.put("user", updatedUser);

            LOG.info("Admin updated user info: User ID {}", userId);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            LOG.warn("Failed to update user info for user {}: {}", userId, e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            // Only expose specific known validation errors
            if (e.getMessage() != null && e.getMessage().contains("Email already exists")) {
                errorResponse.put("message", "Email address is already in use");
            } else if (e.getMessage() != null && e.getMessage().contains("not found")) {
                errorResponse.put("message", "User not found");
            } else {
                errorResponse.put("message", "Unable to update user information");
            }
            errorResponse.put("success", false);
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            LOG.error("Failed to update user info for user {}: {}", userId, e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Unable to update user information");
            errorResponse.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<AdminService.UserStatistics> getUserStatistics() {
        AdminService.UserStatistics stats = adminService.getUserStatistics();
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/users/bulk-status")
    public ResponseEntity<Map<String, Object>> bulkUpdateStatus(
            @RequestBody Map<String, Object> request) {

        try {
            @SuppressWarnings("unchecked")
            List<Integer> userIds = (List<Integer>) request.get("userIds");
            String statusStr = (String) request.get("status");

            if (userIds == null || userIds.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "User IDs list is required");
                errorResponse.put("success", false);
                return ResponseEntity.badRequest().body(errorResponse);
            }

            if (statusStr == null || statusStr.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "Status is required");
                errorResponse.put("success", false);
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Parse status - handle both capitalized and uppercase
            User.UserStatus status;
            try {
                // Try direct match first (capitalized)
                status = User.UserStatus.valueOf(statusStr);
            } catch (IllegalArgumentException e) {
                // Try capitalized version
                String capitalized = statusStr.substring(0, 1).toUpperCase() +
                                   statusStr.substring(1).toLowerCase();
                try {
                    status = User.UserStatus.valueOf(capitalized);
                } catch (IllegalArgumentException ex) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("message", "Invalid status value");
                    errorResponse.put("success", false);
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            int updatedCount = adminService.bulkUpdateUserStatus(userIds, status);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Bulk status update completed");
            response.put("success", true);
            response.put("updatedCount", updatedCount);
            response.put("totalRequested", userIds.size());

            LOG.info("Admin bulk updated status for {} users to {}", updatedCount, status);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            LOG.error("Bulk update failed: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Unable to complete bulk status update");
            errorResponse.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}