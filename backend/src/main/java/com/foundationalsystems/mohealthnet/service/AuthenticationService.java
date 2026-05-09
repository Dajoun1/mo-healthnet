package com.foundationalsystems.mohealthnet.service;

import com.foundationalsystems.mohealthnet.entity.User;
import com.foundationalsystems.mohealthnet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.transaction.annotation.Transactional;

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

    /**
     * Register a new user with bcrypt-hashed password.
     * Email is used as the username for portal login.
     *
     * @param email the user's email (used for portal login as username)
     * @param passwordHash the plaintext password to be hashed
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
    @Transactional
    public User registerUser(String email, String passwordHash, String firstName,
                            String middleName, String lastName, LocalDate birthDate,
                            String ssn, String phone, String streetAddress, String city,
                            String state, String zipCode, User.UserRole role) {

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
        if (ssn != null && !ssn.isEmpty()) {
            user.setSsnHash(passwordEncoder.encode(ssn));
        }
        user.setPhone(phone);
        user.setRole(role != null ? role : User.UserRole.APPLICANT);
        user.setStatus(User.UserStatus.Active);
        if (phone != null && !phone.isEmpty()) {
            String digitsOnly = phone.replaceAll("\\D", "");
            user.setPhone(digitsOnly.length() > 10 ? digitsOnly.substring(0, 10) : digitsOnly);
        }
        user.setStreetAddress(streetAddress);
        user.setCity(city);
        user.setState(state != null ? state.toUpperCase().substring(0, Math.min(2, state.length())) : null);
        user.setZipCode(zipCode != null ? zipCode.replaceAll("\\D", "").substring(0, Math.min(5, zipCode.replaceAll("\\D", "").length())) : null);
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        LOG.info("User registered: email={}, streetAddress={}, city={}, state={}, zip={}, birthDate={}",
            email, streetAddress, city, state, zipCode, birthDate);
        return savedUser;
    }

    public boolean authenticateUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByUsername(email);

        if (userOptional.isEmpty()) {
            LOG.warn("Login attempt with non-existent email: {}", email);
            return false;
        }

        User user = userOptional.get();
        
        if (user.getStatus() == User.UserStatus.Locked) {
            LOG.warn("Login attempt on locked account: {}", email);
            return false;
        }
        
        if (user.getStatus() == User.UserStatus.Disabled) {
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