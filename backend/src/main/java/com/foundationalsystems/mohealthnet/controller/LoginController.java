package com.foundationalsystems.mohealthnet.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller that handles login-related HTTP requests for the MoHealthNet application.
 */
@RestController
public class LoginController {
    @GetMapping("/login")
    public String login() {
        return "Testing login endpoint";
    }
}
