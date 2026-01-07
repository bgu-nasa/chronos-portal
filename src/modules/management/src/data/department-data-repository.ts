/**
 * Department data repository
 * Handles department API calls with organization context
 */

import type {
    DepartmentResponse,
    DepartmentRequest,
} from "@/modules/management/src/data/department.types";

/**
 * Department repository class
 * Provides methods for CRUD operations on departments
 */
export class DepartmentDataRepository {
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
     * Fetch all departments for the current organization
     * @returns Array of departments
     */
    async getAllDepartments(): Promise<DepartmentResponse[]> {
        const response = await $app.ajax.get<DepartmentResponse[]>(
            "/api/management/department",
            { headers: this.getHeaders() }
        );
        return response;
    }

    /**
     * Fetch a single department by ID
     * @param departmentId - The ID of the department to fetch
     * @returns Department details
     */
    async getDepartmentById(departmentId: string): Promise<DepartmentResponse> {
        const response = await $app.ajax.get<DepartmentResponse>(
            `/api/management/department/${departmentId}`,
            { headers: this.getHeaders() }
        );
        return response;
    }

    /**
     * Create a new department
     * @param request - Department creation request with name
     * @returns Created department details
     */
    async createDepartment(
        request: DepartmentRequest
    ): Promise<DepartmentResponse> {
        const response = await $app.ajax.post<DepartmentResponse>(
            "/api/management/department",
            request,
            { headers: this.getHeaders() }
        );
        return response;
    }

    /**
     * Update an existing department
     * @param departmentId - The ID of the department to update
     * @param request - Department update request with new name
     * @returns void (HTTP 204 No Content)
     */
    async updateDepartment(
        departmentId: string,
        request: DepartmentRequest
    ): Promise<void> {
        await $app.ajax.patch<void>(
            `/api/management/department/${departmentId}`,
            request,
            { headers: this.getHeaders() }
        );
    }

    /**
     * Delete (soft delete) a department
     * @param departmentId - The ID of the department to delete
     * @returns void (HTTP 204 No Content)
     */
    async deleteDepartment(departmentId: string): Promise<void> {
        await $app.ajax.delete<void>(
            `/api/management/department/${departmentId}`,
            { headers: this.getHeaders() }
        );
    }

    /**
     * Restore a soft-deleted department
     * @param departmentId - The ID of the department to restore
     * @returns void (HTTP 204 No Content)
     */
    async restoreDepartment(departmentId: string): Promise<void> {
        await $app.ajax.post<void>(
            `/api/management/department/restore/${departmentId}`,
            {},
            { headers: this.getHeaders() }
        );
    }
}

// Export singleton instance
export const departmentDataRepository = new DepartmentDataRepository();
