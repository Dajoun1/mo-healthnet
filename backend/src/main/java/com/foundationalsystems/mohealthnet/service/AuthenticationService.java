package com.foundationalsystems.mohealthnet.service;

import com.foundationalsystems.mohealthnet.entity.User;
import com.foundationalsystems.mohealthnet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Service for handling user authentication and password operations.
 * Uses bcrypt for secure password hashing and verification.
 */
@Service
public class AuthenticationService {

    private static final Logger LOG = LoggerFactory.getLogger(AuthenticationService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Register a new user with bcrypt-hashed password.
     * Email is used as the username for portal login.
     *
     * @param email the user's email (used for portal login as username)
     * @param password the plaintext password to be hashed
     * @param firstName the user's first name
     * @param middleName the user's middle name (optional)
     * @param lastName the user's last name
     * @param birthDate the user's birth date
     * @param ssn the user's SSN (9 chars)
     * @param phone the user's phone number (optional)
     * @param role the user's role (Applicant, Employee, or Admin)
     * @return the created User entity
     * @throws IllegalArgumentException if email already exists
     */
    public User registerUser(String email, String password, String firstName,
                            String middleName, String lastName, LocalDate birthDate,
                            String ssn, String phone, User.UserRole role) {

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered: " + email);
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // Hash password with bcrypt
        user.setFirstName(firstName);
        user.setMiddleName(middleName);
        user.setLastName(lastName);
        user.setBirthDate(birthDate);
        user.setSsn(ssn);
        user.setPhone(phone);
        user.setRole(role != null ? role : User.UserRole.Applicant); // Default to Applicant
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        LOG.info("New user registered successfully: {}", email);
        return savedUser;
    }

    /**
     * Authenticate a user by comparing provided email and password with stored bcrypt hash.
     * Portal login uses email (not username).
     *
     * @param email the user's email
     * @param password the plaintext password provided by the user
     * @return true if credentials are valid, false otherwise
     */
    public boolean authenticateUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            LOG.warn("Login attempt with non-existent email: {}", email);
            return false;
        }

        User user = userOptional.get();

        // Compare plaintext password with stored bcrypt hash
        boolean isPasswordValid = passwordEncoder.matches(password, user.getPassword());

        if (isPasswordValid) {
            // Update last login timestamp
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            LOG.info("User authenticated successfully: {}", email);
        } else {
            LOG.warn("Failed authentication attempt for user: {}", email);
        }

        return isPasswordValid;
    }

    /**
     * Find a user by email.
     *
     * @param email the user's email
     * @return Optional containing the user if found
     */
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Change user password.
     *
     * @param email the user's email
     * @param oldPassword the current password
     * @param newPassword the new password to set
     * @return true if password changed successfully, false otherwise
     */
    public boolean changePassword(String email, String oldPassword, String newPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return false;
        }

        User user = userOptional.get();

        // Verify old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            LOG.warn("Password change attempted with incorrect old password for: {}", email);
            return false;
        }

        // Set new hashed password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        LOG.info("Password changed successfully for user: {}", email);
        return true;
    }
}

