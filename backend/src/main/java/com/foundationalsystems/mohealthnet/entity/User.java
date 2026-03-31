package com.foundationalsystems.mohealthnet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * User entity representing a user in the Employment_App application.
 * Maps to the User table in the database.
 * Stores user credentials with bcrypt-hashed passwords.
 */
@Entity
@Table(name = "User")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String username; // Serves as the unique username for portal login

    @Column(name = "password_hash", nullable = false)
    private String passwordHash; // Stores bcrypt-hashed password (CHAR() recommended for hash length)

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "middle_name", length = 50)
    private String middleName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "birth_date", nullable = true)
    private LocalDate birthDate;

    @Column(nullable = true, length = 9)
    private String ssn;

    @Column(length = 10)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role; // Applicant, Employee, or Admin

    @Column(name = "profile_complete", nullable = false)
    private Boolean profileComplete = false; // Track if user completed their profile

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    @PostLoad
    @PostUpdate
    protected void updateLastLogin() {
        // This will be updated when user logs in
    }

    /**
     * Enum for user roles in the system
     */
    public enum UserRole {
        Applicant, Employee, Admin
    }
}

