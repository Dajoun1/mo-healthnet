package com.foundationalsystems.mohealthnet.controller;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class LoginControllerTest {

    @Test
    void loginEndpointReturnsExpectedResponse() {
        LoginController controller = new LoginController();
        Map<String, String> credentials = Map.of(
                "email", "test@example.com",
                "password", "password123"
        );

        Map<String, String> response = controller.handleLogin(credentials);

        assertThat(response).isNotNull();
        assertThat(response.get("message")).isEqualTo("Login request received successfully");
        assertThat(response.get("email")).isEqualTo("test@example.com");
        assertThat(response.get("status")).isEqualTo("testing");
    }

    @Test
    void loginEndpointWithNullEmailReturnsNull() {
        LoginController controller = new LoginController();
        Map<String, String> credentials = Map.of("password", "password123");

        Map<String, String> response = controller.handleLogin(credentials);

        assertThat(response).isNotNull();
        assertThat(response.get("email")).isNull();
    }
}
