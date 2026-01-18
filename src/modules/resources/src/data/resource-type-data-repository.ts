/**
 * ResourceType data repository
 * Handles resource type API calls with organization context
 */

import { $app } from "@/infra/service";
import type {
    ResourceTypeResponse,
    CreateResourceTypeRequest,
    UpdateResourceTypeRequest,
} from "@/modules/resources/src/data/resource-type.types";

/**
 * ResourceType repository class
 * Provides methods for CRUD operations on resource types
 */
export class ResourceTypeDataRepository {
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
     * Build the base URL for resource type endpoints
     * @param departmentId - The department ID (required in route)
     */
    private getBaseUrl(departmentId: string): string {
        return `/api/department/${departmentId}/resources/resource/types`;
    }

    /**
     * Fetch all resource types for the current organization
     * @param departmentId - The department ID
     * @returns Array of resource types
     */
    async getAllResourceTypes(departmentId: string): Promise<ResourceTypeResponse[]> {
        const url = this.getBaseUrl(departmentId);
        const headers = this.getHeaders();
        
        $app.logger.info("[ResourceTypeDataRepository] Fetching all resource types", { url, headers });
        
        try {
            const response = await $app.ajax.get<ResourceTypeResponse[]>(url, { headers });
            $app.logger.info("[ResourceTypeDataRepository] Fetched resource types", { count: response.length });
            return response;
        } catch (error) {
            $app.logger.error("[ResourceTypeDataRepository] Fetch resource types failed", error);
            throw error;
        }
    }

    /**
     * Fetch a single resource type by ID
     * @param departmentId - The department ID
     * @param resourceTypeId - The ID of the resource type to fetch
     * @returns ResourceType details
     */
    async getResourceTypeById(
        departmentId: string,
        resourceTypeId: string
    ): Promise<ResourceTypeResponse> {
        const url = `${this.getBaseUrl(departmentId)}/${resourceTypeId}`;
        const headers = this.getHeaders();
        
        $app.logger.info("[ResourceTypeDataRepository] Fetching resource type by ID", { url, resourceTypeId });
        
        try {
            const response = await $app.ajax.get<ResourceTypeResponse>(url, { headers });
            $app.logger.info("[ResourceTypeDataRepository] Fetched resource type", { resourceTypeId: response.id });
            return response;
        } catch (error) {
            $app.logger.error("[ResourceTypeDataRepository] Fetch resource type failed", error);
            throw error;
        }
    }

    /**
     * Create a new resource type
     * @param departmentId - The department ID
     * @param request - ResourceType creation request
     * @returns Created resource type details
     */
    async createResourceType(
        departmentId: string,
        request: CreateResourceTypeRequest
    ): Promise<ResourceTypeResponse> {
        const url = this.getBaseUrl(departmentId);
        const headers = this.getHeaders();
        
        $app.logger.info("[ResourceTypeDataRepository] Creating resource type", { url, request });
        
        try {
            const response = await $app.ajax.post<ResourceTypeResponse>(
                url,
                request,
                { headers }
            );
            $app.logger.info("[ResourceTypeDataRepository] Create resource type response", { resourceTypeId: response.id });
            return response;
        } catch (error) {
            $app.logger.error("[ResourceTypeDataRepository] Create resource type failed", error);
            throw error;
        }
    }

    /**
     * Update an existing resource type
     * @param departmentId - The department ID
     * @param resourceTypeId - The ID of the resource type to update
     * @param request - ResourceType update request
     * @returns void (HTTP 204 No Content)
     */
    async updateResourceType(
        departmentId: string,
        resourceTypeId: string,
        request: UpdateResourceTypeRequest
    ): Promise<void> {
        const url = `${this.getBaseUrl(departmentId)}/${resourceTypeId}`;
        const headers = this.getHeaders();
        
        $app.logger.info("[ResourceTypeDataRepository] Updating resource type", { url, resourceTypeId, request });
        
        try {
            await $app.ajax.patch<void>(url, request, { headers });
            $app.logger.info("[ResourceTypeDataRepository] Update resource type successful", { resourceTypeId });
        } catch (error) {
            $app.logger.error("[ResourceTypeDataRepository] Update resource type failed", error);
            throw error;
        }
    }

    /**
     * Delete a resource type
     * @param departmentId - The department ID
     * @param resourceTypeId - The ID of the resource type to delete
     * @returns void (HTTP 204 No Content)
     */
    async deleteResourceType(
        departmentId: string,
        resourceTypeId: string
    ): Promise<void> {
        const url = `${this.getBaseUrl(departmentId)}/${resourceTypeId}`;
        const headers = this.getHeaders();
        
        $app.logger.info("[ResourceTypeDataRepository] Deleting resource type", { url, resourceTypeId });
        
        try {
            await $app.ajax.delete<void>(url, { headers });
            $app.logger.info("[ResourceTypeDataRepository] Delete resource type successful", { resourceTypeId });
        } catch (error) {
            $app.logger.error("[ResourceTypeDataRepository] Delete resource type failed", error);
            throw error;
        }
    }
}

// Export singleton instance
export const resourceTypeDataRepository = new ResourceTypeDataRepository();
