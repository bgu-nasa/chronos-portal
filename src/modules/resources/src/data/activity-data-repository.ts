/**
 * Activity data repository
 * Handles activity API calls with organization context
 */

import type {
    ActivityResponse,
    CreateActivityRequest,
    UpdateActivityRequest,
} from "@/modules/resources/src/data/activity.types";

/**
 * Activity repository class
 * Provides methods for CRUD operations on activities
 */
export class ActivityDataRepository {
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
     * Build the base URL for activity endpoints
     * @param departmentId - The department ID (required in route)
     */
    private getBaseUrl(departmentId: string): string {
        return `/api/department/${departmentId}/resources/subjects/Subject/activities`;
    }

    /**
     * Build URL with subjectId for endpoints that require it
     * @param departmentId - The department ID
     * @param subjectId - The subject ID
     */
    private getSubjectActivitiesUrl(departmentId: string, subjectId: string): string {
        return `/api/department/${departmentId}/resources/subjects/Subject/${subjectId}/activities`;
    }

    /**
     * Fetch all activities for the current organization
     * @param departmentId - The department ID
     * @returns Array of activities
     */
    async getAllActivities(departmentId: string): Promise<ActivityResponse[]> {
        const url = this.getBaseUrl(departmentId);
        const headers = this.getHeaders();
        
        $app.logger.info("[ActivityDataRepository] Fetching all activities:", { url, headers });
        
        try {
            const response = await $app.ajax.get<ActivityResponse[]>(url, { headers });
            $app.logger.info("[ActivityDataRepository] Fetched activities:", response.length);
            return response;
        } catch (error) {
            $app.logger.error("[ActivityDataRepository] Fetch activities failed:", error);
            throw error;
        }
    }

    /**
     * Fetch activities by subject
     * @param departmentId - The department ID
     * @param subjectId - The subject ID to filter by
     * @returns Array of activities
     */
    async getActivitiesBySubject(
        departmentId: string,
        subjectId: string
    ): Promise<ActivityResponse[]> {
        const url = this.getSubjectActivitiesUrl(departmentId, subjectId);
        const headers = this.getHeaders();
        
        $app.logger.info("[ActivityDataRepository] Fetching activities by subject:", { url, subjectId });
        
        try {
            const response = await $app.ajax.get<ActivityResponse[]>(url, { headers });
            $app.logger.info("[ActivityDataRepository] Fetched activities:", response.length);
            return response;
        } catch (error) {
            $app.logger.error("[ActivityDataRepository] Fetch activities by subject failed:", error);
            throw error;
        }
    }

    /**
     * Fetch a single activity by ID
     * @param departmentId - The department ID
     * @param subjectId - The subject ID
     * @param activityId - The ID of the activity to fetch
     * @returns Activity details
     */
    async getActivityById(
        departmentId: string,
        subjectId: string,
        activityId: string
    ): Promise<ActivityResponse> {
        const url = `${this.getSubjectActivitiesUrl(departmentId, subjectId)}/${activityId}`;
        const headers = this.getHeaders();
        
        $app.logger.info("[ActivityDataRepository] Fetching activity by ID:", { url });
        
        try {
            const response = await $app.ajax.get<ActivityResponse>(url, { headers });
            $app.logger.info("[ActivityDataRepository] Fetched activity:", response);
            return response;
        } catch (error) {
            $app.logger.error("[ActivityDataRepository] Fetch activity failed:", error);
            throw error;
        }
    }

    /**
     * Create a new activity
     * @param departmentId - The department ID
     * @param subjectId - The subject ID to create the activity under
     * @param request - Activity creation request
     * @returns Created activity details
     */
    async createActivity(
        departmentId: string,
        subjectId: string,
        request: CreateActivityRequest
    ): Promise<ActivityResponse> {
        const url = this.getSubjectActivitiesUrl(departmentId, subjectId);
        const headers = this.getHeaders();
        
        $app.logger.info("[ActivityDataRepository] Creating activity:", { url, subjectId, headers, request });
        
        try {
            const response = await $app.ajax.post<ActivityResponse>(
                url,
                request,
                { headers }
            );
            $app.logger.info("[ActivityDataRepository] Create activity response:", response);
            return response;
        } catch (error) {
            $app.logger.error("[ActivityDataRepository] Create activity failed:", error);
            throw error;
        }
    }

    /**
     * Update an existing activity
     * @param departmentId - The department ID
     * @param activityId - The ID of the activity to update
     * @param request - Activity update request
     * @returns void (HTTP 204 No Content)
     */
    async updateActivity(
        departmentId: string,
        activityId: string,
        request: UpdateActivityRequest
    ): Promise<void> {
        const url = `${this.getBaseUrl(departmentId)}/${activityId}`;
        const headers = this.getHeaders();
        
        $app.logger.info("[ActivityDataRepository] Updating activity:", { url, headers, request });
        
        try {
            await $app.ajax.patch<void>(url, request, { headers });
            $app.logger.info("[ActivityDataRepository] Update activity successful");
        } catch (error) {
            $app.logger.error("[ActivityDataRepository] Update activity failed:", error);
            throw error;
        }
    }

    /**
     * Delete an activity
     * @param departmentId - The department ID
     * @param activityId - The ID of the activity to delete
     * @returns void (HTTP 204 No Content)
     */
    async deleteActivity(
        departmentId: string,
        activityId: string
    ): Promise<void> {
        const url = `${this.getBaseUrl(departmentId)}/${activityId}`;
        const headers = this.getHeaders();
        
        $app.logger.info("[ActivityDataRepository] Deleting activity:", { url, headers });
        
        try {
            await $app.ajax.delete<void>(url, { headers });
            $app.logger.info("[ActivityDataRepository] Delete activity successful");
        } catch (error) {
            $app.logger.error("[ActivityDataRepository] Delete activity failed:", error);
            throw error;
        }
    }
}

// Export singleton instance
export const activityDataRepository = new ActivityDataRepository();
