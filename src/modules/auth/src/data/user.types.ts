/**
 * User data types
 * Matches the backend User contracts from the Auth module
 */

/**
 * User response contract from API
 * Matches the UserResponse from the backend
 */
export interface UserResponse {
    userId: string; // Guid from C#
    email: string;
    firstName: string;
    lastName: string;
    emailVerified: boolean;
    avatarUrl?: string | null;
}

/**
 * User creation request contract for API
 * Matches the CreateUserRequest from the backend
 */
export interface CreateUserRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

/**
 * User update request contract for API
 * Matches the UserUpdateRequest from the backend
 */
export interface UserUpdateRequest {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string | null;
}
