/**
 * Auth data repository
 * Handles authentication API calls including login and onboarding
 */

import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    PasswordUpdateRequest,
} from "./auth.types";

/**
 * Auth repository class
 * Provides methods for user authentication and organization onboarding
 */
export class AuthDataRepository {
    /**
     * Login user with email and password
     * Sets the token in storage upon successful login
     *
     * @param email - User email
     * @param password - User password
     * @returns Login response with access token
     */
    async login(email: string, password: string): Promise<LoginResponse> {
        const request: LoginRequest = {
            Email: email,
            Password: password,
        };

        // Login is an unauthenticated request
        const response = await $app.ajax.post<LoginResponse>(
            "/api/auth/login",
            request,
            { auth: false },
        );

        // Save token to storage
        if (response.token) {
            $app.token.setToken(response.token);
        }

        return response;
    }

    /**
     * Register new organization with admin user
     * Creates a new organization and admin user account
     * Sets the token in storage upon successful registration
     *
     * @param request - Registration request with admin user and organization details
     * @returns Registration response with access token
     */
    async onboard(request: RegisterRequest): Promise<RegisterResponse> {
        // Registration is an unauthenticated request
        const response = await $app.ajax.post<RegisterResponse>(
            "/api/auth/register",
            request,
            { auth: false },
        );

        // Save token to storage
        if (response.token) {
            $app.token.setToken(response.token);
        }

        return response;
    }

    /**
     * Logout user
     * Clears the token from storage
     */
    logout(): void {
        $app.token.clearToken();
    }

    /**
     * Check if user is authenticated
     * @returns true if user has a valid token
     */
    isAuthenticated(): boolean {
        return $app.token.hasToken();
    }

    /**
     * Update the authenticated user's password
     * @param request - Password update request with old and new passwords
     * @returns void (HTTP 204 No Content)
     */
    async updatePassword(request: PasswordUpdateRequest): Promise<void> {
        await $app.ajax.put<void>("/api/auth/password", {
            OldPassword: request.oldPassword,
            NewPassword: request.newPassword,
        });
    }
}

// Export singleton instance
export const authDataRepository = new AuthDataRepository();
