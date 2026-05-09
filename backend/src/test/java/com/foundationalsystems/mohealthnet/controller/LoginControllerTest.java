package com.foundationalsystems.mohealthnet.controller;

import com.foundationalsystems.mohealthnet.entity.User;
import com.foundationalsystems.mohealthnet.service.AuthenticationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class LoginControllerTest {

    private LoginController controller;
    private AuthenticationService authenticationService;

    @BeforeEach
    void setUp() {
        controller = new LoginController();
        authenticationService = mock(AuthenticationService.class);
        controller.authenticationService = authenticationService;
    }

    @Test
    void loginWithValidCredentialsReturnsSuccess() {
        // Arrange
        User mockUser = new User();
        mockUser.setId(1);
        mockUser.setUsername("test@example.com");
        mockUser.setFirstName("Test");
        mockUser.setLastName("User");
<<<<<<< HEAD
        mockUser.setRole(User.UserRole.APPLICANT);
=======
        mockUser.setRole(User.UserRole.Applicant);
>>>>>>> 5af4e21a812f8dd621bbb1885dc3f5ac628ca1e3

        Map<String, String> credentials = Map.of(
                "email", "test@example.com",
                "password", "password123"
        );

        when(authenticationService.authenticateUser("test@example.com", "password123")).thenReturn(true);
        when(authenticationService.findUserByEmail("test@example.com")).thenReturn(Optional.of(mockUser));

        // Act
        ResponseEntity<Map<String, Object>> response = controller.handleLogin(credentials);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("success")).isEqualTo(true);
        assertThat(response.getBody().get("email")).isEqualTo("test@example.com");
    }

    @Test
    void loginWithInvalidCredentialsReturnsUnauthorized() {
        // Arrange
        Map<String, String> credentials = Map.of(
                "email", "test@example.com",
                "password", "wrongpassword"
        );

        when(authenticationService.authenticateUser("test@example.com", "wrongpassword")).thenReturn(false);

        // Act
        ResponseEntity<Map<String, Object>> response = controller.handleLogin(credentials);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("success")).isEqualTo(false);
    }

    @Test
    void loginWithMissingEmailReturnsBadRequest() {
        // Arrange
        Map<String, String> credentials = Map.of("password", "password123");

        // Act
        ResponseEntity<Map<String, Object>> response = controller.handleLogin(credentials);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("success")).isEqualTo(false);
    }
}
