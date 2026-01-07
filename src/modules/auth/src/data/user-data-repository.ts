/**
 * User data repository
 * Handles user API calls with organization context
 */

import type {
    UserResponse,
    CreateUserRequest,
    UserUpdateRequest,
} from "@/modules/auth/src/data/user.types";

/**
 * User repository class
 * Provides methods for CRUD operations on users
 */
export class UserDataRepository {
    /**
     * Get organization ID from the current organization context
     * @throws Error if no organization is loaded
     */
    private getOrganizationId(): string {
        const organization = $app.organization.getOrganization();
        if (!organization) {
            throw new Error("No organization context available");
        }
        return organization.id;
    }

    /**
     * Get headers with organization ID
     */
    private getHeaders() {
        return {
            "x-org-id": this.getOrganizationId(),
        };
    }

    /**
     * Fetch all users for the current organization
     * @returns Array of users
     */
    async getAllUsers(): Promise<UserResponse[]> {
        const response = await $app.ajax.get<UserResponse[]>("/api/user", {
            headers: this.getHeaders(),
        });
        return response;
    }

    /**
     * Fetch a single user by ID
     * @param userId - The ID of the user to fetch
     * @returns User details
     */
    async getUserById(userId: string): Promise<UserResponse> {
        const response = await $app.ajax.get<UserResponse>(
            `/api/user/${userId}`,
            { headers: this.getHeaders() }
        );
        return response;
    }

    /**
     * Create a new user
     * @param request - User creation request with email, password, firstName, lastName
     * @returns Created user details
     */
    async createUser(request: CreateUserRequest): Promise<UserResponse> {
        const response = await $app.ajax.post<UserResponse>(
            "/api/user",
            request,
            { headers: this.getHeaders() }
        );
        return response;
    }

    /**
     * Update an existing user's profile
     * @param userId - The ID of the user to update
     * @param request - User update request with profile information
     * @returns void (HTTP 204 No Content)
     */
    async updateUser(
        userId: string,
        request: UserUpdateRequest
    ): Promise<void> {
        await $app.ajax.put<void>(`/api/user/${userId}`, request, {
            headers: this.getHeaders(),
        });
    }

    /**
     * Update the authenticated user's own profile
     * @param request - User update request with profile information
     * @returns void (HTTP 204 No Content)
     */
    async updateMyProfile(request: UserUpdateRequest): Promise<void> {
        await $app.ajax.put<void>("/api/user", request, {
            headers: this.getHeaders(),
        });
    }

    /**
     * Delete a user from the organization
     * @param userId - The ID of the user to delete
     * @returns void (HTTP 204 No Content)
     */
    async deleteUser(userId: string): Promise<void> {
        await $app.ajax.delete<void>(`/api/user/${userId}`, {
            headers: this.getHeaders(),
        });
    }
}

// Export singleton instance
export const userDataRepository = new UserDataRepository();
