/**
 * Organization data repository
 * Handles organization API calls
 */

import { $app } from "@/infra/service";
import type { OrganizationInformation } from "./organization.types";

/**
 * Organization repository class
 * Provides methods for fetching organization information
 */
export class OrganizationDataRepository {
    /**
     * Fetch organization information for the authenticated user
     * This is the TenantContext that includes org details, user roles, and departments
     *
     * @returns Organization information including roles and departments
     */
    async getOrganizationInfo(): Promise<OrganizationInformation> {
        // The endpoint is /info based on the HttpGet("/info") attribute
        const response = await $app.ajax.get<OrganizationInformation>(
            "/api/management/organization/info"
        );

        return response;
    }
}

// Export singleton instance
export const organizationDataRepository = new OrganizationDataRepository();
