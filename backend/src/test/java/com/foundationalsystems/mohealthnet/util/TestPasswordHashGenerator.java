package com.foundationalsystems.mohealthnet.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.security.SecureRandom;

/**
 * Utility class to generate reproducible password hashes for testing.
 * Uses a fixed seed to ensure the same password always produces the same hash.
 *
 * Usage: Run this class to generate password hashes for test users.
 */
public class TestPasswordHashGenerator {

    public static void main(String[] args) {
        // same seed as TestSecurityConfig
        SecureRandom secureRandom = new SecureRandom("testSeed123".getBytes());
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10, secureRandom);

        // Generate hashes for test passwords
        String[] testPasswords = {"test123", "test123", "test123"};

        System.out.println("===========================================");
        System.out.println("Test Password Hashes (Fixed Seed)");
        System.out.println("===========================================");
        System.out.println();

        for (String password : testPasswords) {
            String hash = encoder.encode(password);
            System.out.println("Password: " + password);
            System.out.println("Hash:     " + hash);
            System.out.println();
        }

        System.out.println("===========================================");
        System.out.println("Use these hashes in your test SQL data");
        System.out.println("These fixed salts are for testing only");
        System.out.println("===========================================");
    }
}

