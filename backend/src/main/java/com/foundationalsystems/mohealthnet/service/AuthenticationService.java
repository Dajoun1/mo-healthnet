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

@Service
public class AuthenticationService {

    private static final Logger LOG = LoggerFactory.getLogger(AuthenticationService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String email, String passwordHash, String firstName,
                            String middleName, String lastName, LocalDate birthDate,
                            String ssn, String phone, User.UserRole role) {

        if (userRepository.existsByUsername(email)) {
            throw new IllegalArgumentException("Email already registered: " + email);
        }

        User user = new User();
        user.setUsername(email);
        user.setPasswordHash(passwordEncoder.encode(passwordHash));
        user.setFirstName(firstName);
        user.setMiddleName(middleName);
        user.setLastName(lastName);
        user.setBirthDate(birthDate);
        user.setSsn(ssn);
        user.setPhone(phone);
        
        // Default to APPLICANT if role is null
        user.setRole(role != null ? role : User.UserRole.APPLICANT);
        user.setStatus(User.UserStatus.ACTIVE);
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        LOG.info("New user registered successfully: {}", email);
        return savedUser;
    }

    public boolean authenticateUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByUsername(email);

        if (userOptional.isEmpty()) {
            LOG.warn("Login attempt with non-existent email: {}", email);
            return false;
        }

        User user = userOptional.get();
        
        if (user.getStatus() == User.UserStatus.LOCKED) {
            LOG.warn("Login attempt on locked account: {}", email);
            return false;
        }
        
        if (user.getStatus() == User.UserStatus.DISABLED) {
            LOG.warn("Login attempt on disabled account: {}", email);
            return false;
        }

        boolean isPasswordValid = passwordEncoder.matches(password, user.getPasswordHash());

        if (isPasswordValid) {
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            LOG.info("User authenticated successfully: {}", email);
        } else {
            LOG.warn("Failed authentication attempt for user: {}", email);
        }

        return isPasswordValid;
    }

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByUsername(email);
    }
    
    public boolean isAdmin(String email) {
        Optional<User> userOptional = userRepository.findByUsername(email);
        return userOptional.isPresent() && userOptional.get().getRole() == User.UserRole.ADMIN;
    }
    
    public User.UserRole getUserRole(String email) {
        Optional<User> userOptional = userRepository.findByUsername(email);
        return userOptional.map(User::getRole).orElse(null);
    }
}