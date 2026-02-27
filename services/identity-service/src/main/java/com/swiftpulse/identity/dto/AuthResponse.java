package com.swiftpulse.identity.dto;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private String userType;

    // Constructors
    public AuthResponse() {}

    public AuthResponse(String token, Long userId, String email, String firstName, String lastName, String userType) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userType = userType;
    }

    // Builder pattern
    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }

    // Builder class
    public static class AuthResponseBuilder {
        private String token;
        private String type = "Bearer";
        private Long userId;
        private String email;
        private String firstName;
        private String lastName;
        private String userType;

        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder type(String type) { this.type = type; return this; }
        public AuthResponseBuilder userId(Long userId) { this.userId = userId; return this; }
        public AuthResponseBuilder email(String email) { this.email = email; return this; }
        public AuthResponseBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        public AuthResponseBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        public AuthResponseBuilder userType(String userType) { this.userType = userType; return this; }

        public AuthResponse build() {
            AuthResponse response = new AuthResponse();
            response.token = this.token;
            response.type = this.type;
            response.userId = this.userId;
            response.email = this.email;
            response.firstName = this.firstName;
            response.lastName = this.lastName;
            response.userType = this.userType;
            return response;
        }
    }
}
