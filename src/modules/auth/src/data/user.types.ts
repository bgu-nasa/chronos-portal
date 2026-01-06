/**
 * User data types
 * Matches the backend User contracts from the Auth module
 */

/**
 * User response contract from API
 * Matches the UserResponse from the backend
 */
export interface UserResponse {
    id: string; // Guid from C# (backend returns 'id', not 'userId')
    email: string;
    firstName: string;
    lastName: string;
    verified: boolean; // backend returns 'verified', not 'emailVerified'
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
