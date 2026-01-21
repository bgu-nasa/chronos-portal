/**
 * Resource data repository for Schedule Module
 * Fetches resources from the Resource API for use in assignment dropdowns
 */

import type { ResourceResponse } from "@/modules/schedule/src/data/resource.types";

/**
 * Resource repository class
 * Provides methods to fetch resources for assignment selection
 */
export class ResourceDataRepository {
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
     * Fetch all resources for the organization
     * @returns Array of resources
     */
    async getAllResources(): Promise<ResourceResponse[]> {
        const response = await $app.ajax.get<ResourceResponse[]>(
            `/api/resources/resource`,
            { headers: this.getHeaders() }
        );
        return response;
    }

    /**
     * Fetch a single resource by ID
     * @param resourceId - The ID of the resource
     * @returns Resource details
     */
    async getResource(resourceId: string): Promise<ResourceResponse> {
        const response = await $app.ajax.get<ResourceResponse>(
            `/api/resources/resource/${resourceId}`,
            { headers: this.getHeaders() }
        );
        return response;
    }
}

// Export singleton instance
export const resourceDataRepository = new ResourceDataRepository();
