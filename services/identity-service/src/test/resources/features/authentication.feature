Feature: User Authentication
  As a user of the SwiftPulse logistics platform
  I want to be able to register, login, and manage my account
  So that I can access the platform's features and track my shipments

  Background:
    Given the authentication service is running
    And the database is clean

  @registration
  Scenario: Successful user registration
    Given I am a new user with valid details
      | firstName | John |
      | lastName  | Doe |
      | email     | john.doe@example.com |
      | phone     | +1234567890 |
      | password  | SecurePass123 |
    When I register with my details
    Then I should receive a successful registration response
    And I should receive a valid JWT token
    And my account should be created in the database
    And the token should contain my user information

  @registration @validation
  Scenario: Registration with invalid email
    Given I am a new user with invalid email
      | firstName | John |
      | lastName  | Doe |
      | email     | invalid-email |
      | phone     | +1234567890 |
      | password  | SecurePass123 |
    When I register with my details
    Then I should receive a validation error
    And the error message should mention invalid email format

  @registration @validation
  Scenario: Registration with weak password
    Given I am a new user with weak password
      | firstName | John |
      | lastName  | Doe |
      | email     | john.doe@example.com |
      | phone     | +1234567890 |
      | password  | 123 |
    When I register with my details
    Then I should receive a validation error
    And the error message should mention password requirements

  @registration @duplicate
  Scenario: Registration with existing email
    Given a user already exists with email "existing@example.com"
    And I try to register with the same email
      | firstName | Jane |
      | lastName  | Smith |
      | email     | existing@example.com |
      | phone     | +0987654321 |
      | password  | AnotherPass123 |
    When I register with my details
    Then I should receive an error response
    And the error message should indicate email already exists

  @login
  Scenario: Successful user login
    Given a registered user exists with credentials
      | email    | test@example.com |
      | password | TestPass123 |
    When I login with valid credentials
    Then I should receive a successful login response
    And I should receive a valid JWT token
    And the token should contain my user ID and email

  @login @invalid
  Scenario: Login with invalid credentials
    Given a registered user exists with email "test@example.com"
    When I login with invalid credentials
      | email    | test@example.com |
      | password | WrongPassword |
    Then I should receive an authentication error
    And the error message should indicate invalid credentials

  @login @notfound
  Scenario: Login with non-existent user
    When I login with non-existent credentials
      | email    | nonexistent@example.com |
      | password | SomePassword123 |
    Then I should receive an authentication error
    And the error message should indicate user not found

  @token @validation
  Scenario: Token validation
    Given I am authenticated with a valid token
    When I validate my token
    Then I should receive my user profile information
    And the response should contain my user details

  @token @invalid
  Scenario: Invalid token validation
    When I validate an invalid token
    Then I should receive an authentication error
    And the error message should indicate invalid token

  @profile
  Scenario: Get user profile
    Given I am authenticated as a user with ID 1
    When I request my user profile
    Then I should receive my profile information
    And the profile should contain my personal details
    And the profile should not contain my password

  @profile @unauthorized
  Scenario: Get profile without authentication
    When I request user profile without authentication
    Then I should receive an unauthorized error
    And the error message should indicate authentication required

  @security @jwt
  Scenario: JWT token expiration
    Given I have an expired JWT token
    When I try to access a protected endpoint with the expired token
    Then I should receive an authentication error
    And the error message should indicate token expired

  @security @jwt
  Scenario: JWT token tampering
    Given I have a tampered JWT token
    When I try to access a protected endpoint with the tampered token
    Then I should receive an authentication error
    And the error message should indicate invalid token signature
