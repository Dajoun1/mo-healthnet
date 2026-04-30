package com.foundationalsystems.mohealthnet.service;

import com.foundationalsystems.mohealthnet.dto.UserSummary;
import com.foundationalsystems.mohealthnet.entity.User;
import com.foundationalsystems.mohealthnet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private static final Logger LOG = LoggerFactory.getLogger(AdminService.class);

    @Autowired
    private UserRepository userRepository;

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public Optional<User> getUserById(Integer userId) {
        return userRepository.findById(userId);
    }

    public Page<User> searchUsers(String searchTerm, Pageable pageable) {
        return userRepository.searchUsers(searchTerm, pageable);
    }

    public Page<UserSummary> getUsersByRole(User.UserRole role, Pageable pageable) {
        return userRepository.findByRole(role, pageable);
    }

    public Page<UserSummary> getUsersByStatus(User.UserStatus status, Pageable pageable) {
        return userRepository.findByStatus(status, pageable);
    }

    public List<UserSummary> getUsersByRole(User.UserRole role) {
        return userRepository.findByRole(role);
    }

    public List<UserSummary> getUsersByStatus(User.UserStatus status) {
        return userRepository.findByStatus(status);
    }

    private User.UserRole parseRole(String roleStr) {
        if (roleStr == null) {
            return null;
        }

        // Try case-insensitive matching
        String upperRole = roleStr.toUpperCase();
        try {
            return User.UserRole.valueOf(upperRole);
        } catch (IllegalArgumentException e) {
            // Handle common variations
            switch (upperRole) {
                case "APPLICANT":
                case "APPLICANTS":
                    return User.UserRole.APPLICANT;
                case "EMPLOYEE":
                case "EMPLOYEES":
                    return User.UserRole.EMPLOYEE;
                case "ADMIN":
                case "ADMINISTRATOR":
                    return User.UserRole.ADMIN;
                default:
                    throw new IllegalArgumentException(
                            "Invalid role: " + roleStr + ". Valid roles: APPLICANT, EMPLOYEE, ADMIN");
            }
        }
    }

    @Transactional
    public User updateUserRole(Integer userId, String roleStr) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found with ID: " + userId);
        }

        User user = userOptional.get();
        User.UserRole newRole = parseRole(roleStr);

        user.setRole(newRole);
        User updatedUser = userRepository.save(user);

        LOG.info("User role updated: User ID {} to role {}", userId, newRole);
        return updatedUser;
    }

    @Transactional
    public User updateUserStatus(Integer userId, User.UserStatus newStatus) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found with ID: " + userId);
        }

        User user = userOptional.get();

        user.setStatus(newStatus);
        User updatedUser = userRepository.save(user);

        LOG.info("User status updated: User ID {} to status {}", userId, newStatus);
        return updatedUser;
    }

    @Transactional
    public void deleteUser(Integer userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found with ID: " + userId);
        }

        // Prevent admin from deleting their own account

        userRepository.deleteById(userId);
        LOG.info("User deleted: User ID {}", userId);
    }

    @Transactional
    public User updateUserInfo(Integer userId, String firstName, String lastName,
            String middleName, String email) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found with ID: " + userId);
        }

        User user = userOptional.get();

        // Check if email is being changed and if it is already taken
        if (email != null && !email.equals(user.getUsername())) {
            if (userRepository.existsByUsername(email)) {
                throw new IllegalArgumentException("Email already exists: " + email);
            }
            user.setUsername(email);
        }

        if (firstName != null && !firstName.trim().isEmpty()) {
            user.setFirstName(firstName);
        }

        if (lastName != null && !lastName.trim().isEmpty()) {
            user.setLastName(lastName);
        }

        if (middleName != null) {
            user.setMiddleName(middleName);
        }

        User updatedUser = userRepository.save(user);
        LOG.info("User information updated: User ID {}", userId);
        return updatedUser;
    }

    public UserStatistics getUserStatistics() {
        UserStatistics stats = new UserStatistics();
        stats.setTotalUsers(userRepository.count());
        stats.setActiveUsers(userRepository.countByStatus(User.UserStatus.ACTIVE));
        stats.setLockedUsers(userRepository.countByStatus(User.UserStatus.LOCKED));
        stats.setDisabledUsers(userRepository.countByStatus(User.UserStatus.DISABLED));
        stats.setAdminUsers(userRepository.countByRole(User.UserRole.ADMIN));
        stats.setEmployeeUsers(userRepository.countByRole(User.UserRole.EMPLOYEE));
        stats.setApplicantUsers(userRepository.countByRole(User.UserRole.APPLICANT));
        return stats;
    }

    @Transactional
    public int bulkUpdateUserStatus(List<Integer> userIds, User.UserStatus status) {
        int updatedCount = 0;
        for (Integer userId : userIds) {
            try {
                updateUserStatus(userId, status);
                updatedCount++;
            } catch (Exception e) {
                LOG.error("Failed to update status for user ID {}: {}", userId, e.getMessage());
            }
        }
        LOG.info("Bulk status update completed: {} users updated to {}", updatedCount, status);
        return updatedCount;
    }

    public static class UserStatistics {
        private long totalUsers;
        private long activeUsers;
        private long lockedUsers;
        private long disabledUsers;
        private long adminUsers;
        private long employeeUsers;
        private long applicantUsers;

        // Getters and setters
        public long getTotalUsers() {
            return totalUsers;
        }

        public void setTotalUsers(long totalUsers) {
            this.totalUsers = totalUsers;
        }

        public long getActiveUsers() {
            return activeUsers;
        }

        public void setActiveUsers(long activeUsers) {
            this.activeUsers = activeUsers;
        }

        public long getLockedUsers() {
            return lockedUsers;
        }

        public void setLockedUsers(long lockedUsers) {
            this.lockedUsers = lockedUsers;
        }

        public long getDisabledUsers() {
            return disabledUsers;
        }

        public void setDisabledUsers(long disabledUsers) {
            this.disabledUsers = disabledUsers;
        }

        public long getAdminUsers() {
            return adminUsers;
        }

        public void setAdminUsers(long adminUsers) {
            this.adminUsers = adminUsers;
        }

        public long getEmployeeUsers() {
            return employeeUsers;
        }

        public void setEmployeeUsers(long employeeUsers) {
            this.employeeUsers = employeeUsers;
        }

        public long getApplicantUsers() {
            return applicantUsers;
        }

        public void setApplicantUsers(long applicantUsers) {
            this.applicantUsers = applicantUsers;
        }
    }
}