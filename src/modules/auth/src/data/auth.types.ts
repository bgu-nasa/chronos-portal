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
    accessToken: string;
    // Add other fields if backend returns them
}

/**
 * Create user request contract
 */
export interface CreateUserRequest {
    Email: string;
    FirstName: string;
    LastName: string;
    Password: string;
}

/**
 * Register/Onboard request contract
 */
export interface RegisterRequest {
    AdminUser: CreateUserRequest;
    OrganizationName: string;
    Plan: string; // "Free" | "Consumption" | "Enterprise"
}

/**
 * Register response contract
 */
export interface RegisterResponse {
    accessToken: string;
    // Add other fields if backend returns them
}
