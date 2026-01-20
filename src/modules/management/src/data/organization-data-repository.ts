/**
 * Organization data repository
 * Handles organization API calls
 */

import type { OrganizationInfoResponse } from "@/modules/management/src/data/organization.types";

/**
 * Organization repository class
 * Provides methods for organization operations
 */
export class OrganizationDataRepository {
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
     * Get organization information
     * @returns Organization information including user details
     */
    async getOrganizationInfo(): Promise<OrganizationInfoResponse> {
        const response = await $app.ajax.get<OrganizationInfoResponse>(
            "/api/management/organization/info",
            { headers: this.getHeaders() },
        );
        return response;
    }

    /**
     * Delete (soft delete) the organization
     * Requires Administrator role
     * @returns void (HTTP 204 No Content)
     */
    async deleteOrganization(): Promise<void> {
        await $app.ajax.delete<void>("/api/management/organization", {
            headers: this.getHeaders(),
        });
    }

    /**
     * Restore a soft-deleted organization
     * Requires Administrator role
     * @returns void (HTTP 204 No Content)
     */
    async restoreOrganization(): Promise<void> {
        await $app.ajax.post<void>(
            "/api/management/organization/restore",
            {},
            { headers: this.getHeaders() },
        );
    }
}

// Export singleton instance
export const organizationDataRepository = new OrganizationDataRepository();
