/**
 * Role data repository
 * Handles role assignment API calls with organization context
 */

import type {
    RoleAssignmentResponse,
    UserRoleAssignmentSummary,
    RoleAssignmentRequest,
} from "@/modules/management/src/data/role.types";

/**
 * Role repository class
 * Provides methods for CRUD operations on role assignments
 */
export class RoleDataRepository {
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
     * Fetch all role assignments for the current organization
     * @returns Array of role assignments
     */
    async getAllRoleAssignments(): Promise<RoleAssignmentResponse[]> {
        const response = await $app.ajax.get<RoleAssignmentResponse[]>(
            "/api/management/role",
            { headers: this.getHeaders() }
        );
        return response;
    }

    /**
     * Fetch role assignments summary (grouped by user)
     * @returns Array of user role assignment summaries
     */
    async getRoleAssignmentsSummary(): Promise<UserRoleAssignmentSummary[]> {
        const response = await $app.ajax.get<UserRoleAssignmentSummary[]>(
            "/api/management/role/summary",
            { headers: this.getHeaders() }
        );
        return response;
    }

    /**
     * Fetch role assignments for a specific user
     * @param userId - The ID of the user
     * @returns Array of role assignments for the user
     */
    async getUserRoleAssignments(
        userId: string
    ): Promise<RoleAssignmentResponse[]> {
        const response = await $app.ajax.get<RoleAssignmentResponse[]>(
            `/api/management/role/user/${userId}`,
            { headers: this.getHeaders() }
        );
        return response;
    }

    /**
     * Fetch a single role assignment by ID
     * @param roleAssignmentId - The ID of the role assignment to fetch
     * @returns Role assignment details
     */
    async getRoleAssignmentById(
        roleAssignmentId: string
    ): Promise<RoleAssignmentResponse> {
        const response = await $app.ajax.get<RoleAssignmentResponse>(
            `/api/management/role/${roleAssignmentId}`,
            { headers: this.getHeaders() }
        );
        return response;
    }

    /**
     * Create a new role assignment
     * @param request - Role assignment creation request
     * @returns Created role assignment details
     */
    async createRoleAssignment(
        request: RoleAssignmentRequest
    ): Promise<RoleAssignmentResponse> {
        const response = await $app.ajax.post<RoleAssignmentResponse>(
            "/api/management/role",
            request,
            { headers: this.getHeaders() }
        );
        return response;
    }

    /**
     * Remove a role assignment
     * @param roleAssignmentId - The ID of the role assignment to remove
     * @returns void (HTTP 204 No Content)
     */
    async removeRoleAssignment(roleAssignmentId: string): Promise<void> {
        await $app.ajax.delete<void>(
            `/api/management/role/${roleAssignmentId}`,
            { headers: this.getHeaders() }
        );
    }
}

// Export singleton instance
export const roleDataRepository = new RoleDataRepository();
