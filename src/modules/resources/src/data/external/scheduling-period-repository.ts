/**
 * Scheduling Period Repository
 * Read-only repository for fetching scheduling period information
 * Used for dropdowns and display purposes in the resources module
 */

import type { SchedulingPeriod } from "./scheduling-period.types";

export class SchedulingPeriodRepository {
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
     * Fetch all scheduling periods for the current organization
     * @returns Array of scheduling periods
     */
    async getAll(): Promise<SchedulingPeriod[]> {
        $app.logger.info("[SchedulingPeriodRepository] Fetching all scheduling periods");
        try {
            const response = await $app.ajax.get<SchedulingPeriod[]>(
                "/api/schedule/scheduling/periods",
                { headers: this.getHeaders() }
            );
            $app.logger.info("[SchedulingPeriodRepository] Fetched scheduling periods", { count: response.length });
            return response;
        } catch (error) {
            $app.logger.error("[SchedulingPeriodRepository] Error fetching scheduling periods:", error);
            throw error;
        }
    }

    /**
     * Fetch a single scheduling period by ID
     * @param id - The scheduling period ID
     * @returns Scheduling period
     */
    async getById(id: string): Promise<SchedulingPeriod> {
        $app.logger.info("[SchedulingPeriodRepository] Fetching scheduling period", { id });
        try {
            const response = await $app.ajax.get<SchedulingPeriod>(
                `/api/schedule/scheduling/periods/${id}`,
                { headers: this.getHeaders() }
            );
            $app.logger.info("[SchedulingPeriodRepository] Fetched scheduling period", { id });
            return response;
        } catch (error) {
            $app.logger.error("[SchedulingPeriodRepository] Error fetching scheduling period:", error);
            throw error;
        }
    }
}

export const schedulingPeriodRepository = new SchedulingPeriodRepository();
