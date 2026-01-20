/**
 * Auth data repository types
 * These match the backend request/response contracts
 */

/**
 * Login request contract
 */
export interface LoginRequest {
    Email: string;
    Password: string;
}

/**
 * Login response contract
 */
export interface LoginResponse {
    token: string;
    // Add other fields if backend returns them
}

/**
 * Register user request contract (for onboarding)
 */
export interface RegisterUserRequest {
    Email: string;
    FirstName: string;
    LastName: string;
    Password: string;
}

/**
 * Register/Onboard request contract
 */
export interface RegisterRequest {
    AdminUser: RegisterUserRequest;
    OrganizationName: string;
    Plan: string; // "Free" | "Consumption" | "Enterprise"
}

/**
 * Register response contract
 */
export interface RegisterResponse {
    token: string;
    // Add other fields if backend returns them
}

/**
 * Password update request contract
 */
export interface PasswordUpdateRequest {
    oldPassword: string;
    newPassword: string;
}
