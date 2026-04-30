package com.foundationalsystems.mohealthnet.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility class for generating BCrypt password hashes for test/seed data.
 *
 * Run the main method directly to print hashes to the console.
 * Copy the output into test-data.sql or any other seed script.
 *
 * Usage:
 *   Right-click → Run 'TestPasswordHashGenerator.main()'
 *   or: mvn exec:java -Dexec.mainClass="com.foundationalsystems.mohealthnet.util.TestPasswordHashGenerator"
 */
public class TestPasswordHashGenerator {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String[] passwords = {
            "applicant123",
            "admin123",
            "caseworker123"
        };

        System.out.println("=== BCrypt Password Hashes ===");
        for (String password : passwords) {
            String hash = encoder.encode(password);
            System.out.printf("Password: %-20s Hash: %s%n", password, hash);
        }

        // You can also hash a custom password by passing it as a command-line argument:
        // e.g. mvn exec:java ... -Dexec.args="mySecretPassword"
        if (args.length > 0) {
            System.out.println("\n=== Custom Password(s) ===");
            for (String arg : args) {
                String hash = encoder.encode(arg);
                System.out.printf("Password: %-20s Hash: %s%n", arg, hash);
            }
        }
    }
}

