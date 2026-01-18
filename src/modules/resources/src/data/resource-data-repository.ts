/**
 * Resource data repository
 * Handles resource API calls with organization context
 */

import { $app } from "@/infra/service";
import type {
    ResourceResponse,
    CreateResourceRequest,
    UpdateResourceRequest,
} from "@/modules/resources/src/data/resource.types";

/**
 * Resource repository class
 * Provides methods for CRUD operations on resources
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
     * Build the base URL for resource endpoints
     * @param departmentId - The department ID (required in route)
     */
    private getBaseUrl(departmentId: string): string {
        return `/api/department/${departmentId}/resources/resource`;
    }

    /**
     * Fetch all resources for the current organization
     * @param departmentId - The department ID
     * @returns Array of resources
     */
    async getAllResources(departmentId: string): Promise<ResourceResponse[]> {
        const url = this.getBaseUrl(departmentId);
        const headers = this.getHeaders();
        
        $app.logger.info("[ResourceDataRepository] Fetching all resources", { url, headers });
        
        try {
            const response = await $app.ajax.get<ResourceResponse[]>(url, { headers });
            $app.logger.info("[ResourceDataRepository] Fetched resources", { count: response.length });
            return response;
        } catch (error) {
            $app.logger.error("[ResourceDataRepository] Fetch resources failed", error);
            throw error;
        }
    }

    /**
     * Fetch a single resource by ID
     * @param departmentId - The department ID
     * @param resourceId - The ID of the resource to fetch
     * @returns Resource details
     */
    async getResourceById(
        departmentId: string,
        resourceId: string
    ): Promise<ResourceResponse> {
        const url = `${this.getBaseUrl(departmentId)}/${resourceId}`;
        const headers = this.getHeaders();
        
        $app.logger.info("[ResourceDataRepository] Fetching resource by ID", { url, resourceId });
        
        try {
            const response = await $app.ajax.get<ResourceResponse>(url, { headers });
            $app.logger.info("[ResourceDataRepository] Fetched resource", { resourceId: response.id });
            return response;
        } catch (error) {
            $app.logger.error("[ResourceDataRepository] Fetch resource failed", error);
            throw error;
        }
    }

    /**
     * Create a new resource
     * @param departmentId - The department ID
     * @param request - Resource creation request
     * @returns Created resource details
     */
    async createResource(
        departmentId: string,
        request: CreateResourceRequest
    ): Promise<ResourceResponse> {
        const url = this.getBaseUrl(departmentId);
        const headers = this.getHeaders();
        
        $app.logger.info("[ResourceDataRepository] Creating resource", { url, request });
        
        try {
            const response = await $app.ajax.post<ResourceResponse>(
                url,
                request,
                { headers }
            );
            $app.logger.info("[ResourceDataRepository] Create resource response", { resourceId: response.id });
            return response;
        } catch (error) {
            $app.logger.error("[ResourceDataRepository] Create resource failed", error);
            throw error;
        }
    }

    /**
     * Update an existing resource
     * @param departmentId - The department ID
     * @param resourceId - The ID of the resource to update
     * @param request - Resource update request
     * @returns void (HTTP 204 No Content)
     */
    async updateResource(
        departmentId: string,
        resourceId: string,
        request: UpdateResourceRequest
    ): Promise<void> {
        const url = `${this.getBaseUrl(departmentId)}/${resourceId}`;
        const headers = this.getHeaders();
        
        $app.logger.info("[ResourceDataRepository] Updating resource", { url, resourceId, request });
        
        try {
            await $app.ajax.patch<void>(url, request, { headers });
            $app.logger.info("[ResourceDataRepository] Update resource successful", { resourceId });
        } catch (error) {
            $app.logger.error("[ResourceDataRepository] Update resource failed", error);
            throw error;
        }
    }

    /**
     * Delete a resource
     * @param departmentId - The department ID
     * @param resourceId - The ID of the resource to delete
     * @returns void (HTTP 204 No Content)
     */
    async deleteResource(
        departmentId: string,
        resourceId: string
    ): Promise<void> {
        const url = `${this.getBaseUrl(departmentId)}/${resourceId}`;
        const headers = this.getHeaders();
        
        $app.logger.info("[ResourceDataRepository] Deleting resource", { url, resourceId });
        
        try {
            await $app.ajax.delete<void>(url, { headers });
            $app.logger.info("[ResourceDataRepository] Delete resource successful", { resourceId });
        } catch (error) {
            $app.logger.error("[ResourceDataRepository] Delete resource failed", error);
            throw error;
        }
    }
}

// Export singleton instance
export const resourceDataRepository = new ResourceDataRepository();
