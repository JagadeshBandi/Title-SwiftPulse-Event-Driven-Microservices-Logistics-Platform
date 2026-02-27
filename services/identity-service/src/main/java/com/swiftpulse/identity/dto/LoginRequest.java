package com.swiftpulse.identity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class LoginRequest {
    
    @NotBlank(message = "Email is required")
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    // Constructors
    public LoginRequest() {}

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Builder pattern
    public static LoginRequestBuilder builder() {
        return new LoginRequestBuilder();
    }

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    // Builder class
    public static class LoginRequestBuilder {
        private String email;
        private String password;

        public LoginRequestBuilder email(String email) { this.email = email; return this; }
        public LoginRequestBuilder password(String password) { this.password = password; return this; }

        public LoginRequest build() {
            return new LoginRequest(email, password);
        }
    }
}
