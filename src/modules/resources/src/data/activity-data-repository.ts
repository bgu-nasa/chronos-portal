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
        return `/api/department/${departmentId}/resources/subjects/subject`;
    }

    /**
     * Fetch all activities for the current organization
     * @param departmentId - The department ID
     * @returns Array of activities
     */
    async getAllActivities(departmentId: string): Promise<ActivityResponse[]> {
        const response = await $app.ajax.get<ActivityResponse[]>(
            `${this.getBaseUrl(departmentId)}/activities`,
            { headers: this.getHeaders() }
        );
        return response;
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
        const response = await $app.ajax.get<ActivityResponse[]>(
            `${this.getBaseUrl(departmentId)}/${subjectId}/activities`,
            { headers: this.getHeaders() }
        );
        return response;
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
        const response = await $app.ajax.get<ActivityResponse>(
            `${this.getBaseUrl(departmentId)}/${subjectId}/activities/${activityId}`,
            { headers: this.getHeaders() }
        );
        return response;
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
        const response = await $app.ajax.post<ActivityResponse>(
            `${this.getBaseUrl(departmentId)}/${subjectId}/activities`,
            request,
            { headers: this.getHeaders() }
        );
        return response;
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
        await $app.ajax.patch<void>(
            `${this.getBaseUrl(departmentId)}/activities/${activityId}`,
            request,
            { headers: this.getHeaders() }
        );
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
        await $app.ajax.delete<void>(
            `${this.getBaseUrl(departmentId)}/activities/${activityId}`,
            { headers: this.getHeaders() }
        );
    }
}

// Export singleton instance
export const activityDataRepository = new ActivityDataRepository();
