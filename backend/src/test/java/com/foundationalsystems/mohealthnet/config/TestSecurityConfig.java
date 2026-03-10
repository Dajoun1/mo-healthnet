package com.foundationalsystems.mohealthnet.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.security.SecureRandom;

/**
 * Test-only security configuration that provides reproducible password hashing.
 * Uses a fixed seed for BCrypt so the same password always produces the same hash.
 *
 * ⚠️ WARNING: NEVER use this in production! Fixed salts defeat the security of BCrypt.
 * This is ONLY for testing with pre-populated test data.
 */
@TestConfiguration
public class TestSecurityConfig {

    /**
     * Test-only PasswordEncoder with fixed salt for reproducible hashing.
     * This allows tests to use pre-generated password hashes.
     *
     * @return PasswordEncoder with fixed seed
     */
    @Bean
    @Primary
    public PasswordEncoder testPasswordEncoder() {
        // Fixed seed for reproducible test hashes
        SecureRandom secureRandom = new SecureRandom("testSeed123".getBytes());
        return new BCryptPasswordEncoder(10, secureRandom);
    }
}

