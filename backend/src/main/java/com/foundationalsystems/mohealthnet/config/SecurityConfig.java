package com.foundationalsystems.mohealthnet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

/**
 * Security configuration for the MoHealthNet application.
 * Provides bcrypt password encoding for secure password storage.
 */
@Configuration
public class SecurityConfig {

    /**
     * Bean for bcrypt password encoder.
     * Bcrypt automatically handles salt generation and hashing.
     * Strength 12 provides security and maintains performance.
     *
     * @return PasswordEncoder bean for bcrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    /**
     * Bean for authentication manager.
     * Required for manual authentication in controllers.
     *
     * @param authenticationConfiguration the authentication configuration
     * @return AuthenticationManager bean
     * @throws Exception if configuration fails
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}

