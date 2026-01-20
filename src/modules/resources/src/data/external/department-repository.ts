/**
 * Department Repository
 * Read-only repository for fetching department information
 * Used for dropdowns and display purposes in the resources module
 */

import { $app } from "@/infra/service";
import type { Department } from "./department.types";

export class DepartmentRepository {
    /**
     * Get organization ID from the current organization context
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
    async getAll(): Promise<Department[]> {
        $app.logger.info("[DepartmentRepository] Fetching all departments");
        try {
            const response = await $app.ajax.get<Department[]>(
                "/api/management/department",
                { headers: this.getHeaders() }
            );
            $app.logger.info("[DepartmentRepository] Fetched departments", { count: response.length });
            return response;
        } catch (error) {
            $app.logger.error("[DepartmentRepository] Error fetching departments:", error);
            throw error;
        }
    }

    /**
     * Fetch a single department by ID
     * @param id - The department ID
     * @returns Department
     */
    async getById(id: string): Promise<Department> {
        $app.logger.info("[DepartmentRepository] Fetching department", { id });
        try {
            const response = await $app.ajax.get<Department>(
                `/api/management/department/${id}`,
                { headers: this.getHeaders() }
            );
            $app.logger.info("[DepartmentRepository] Fetched department", { id });
            return response;
        } catch (error) {
            $app.logger.error("[DepartmentRepository] Error fetching department:", error);
            throw error;
        }
    }
}

export const departmentRepository = new DepartmentRepository();
