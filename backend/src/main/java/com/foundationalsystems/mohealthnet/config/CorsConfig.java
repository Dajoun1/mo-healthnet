package com.foundationalsystems.mohealthnet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    private static final List<String> ALLOWED_ORIGINS = Arrays.asList(
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174"
    );

    private static final List<String> ALLOWED_METHODS = Arrays.asList(
        "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
    );

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(ALLOWED_ORIGINS);
        config.addAllowedHeader("*");
        config.setAllowedMethods(ALLOWED_METHODS);
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    /**
     * Security filter chain configuration to allow authentication endpoints without CSRF protection.
     * This is necessary for stateless API authentication.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless API
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/auth/login", "/auth/register").permitAll()
                .anyRequest().permitAll() // Allow all requests for now
            );

        return http.build();
    }

    /**
     * CORS configuration source for Security filter chain.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(ALLOWED_ORIGINS);
        config.addAllowedHeader("*");
        config.setAllowedMethods(ALLOWED_METHODS);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
