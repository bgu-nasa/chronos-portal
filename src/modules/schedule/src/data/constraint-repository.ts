/**
 * Constraint data repository
 * Handles all constraint-related API calls
 */

import type {
    ActivityConstraintResponse,
    CreateActivityConstraintRequest,
    UpdateActivityConstraintRequest,
    UserConstraintResponse,
    CreateUserConstraintRequest,
    UpdateUserConstraintRequest,
    UserPreferenceResponse,
    CreateUserPreferenceRequest,
    UpdateUserPreferenceRequest,
    OrganizationPolicyResponse,
    CreateOrganizationPolicyRequest,
    UpdateOrganizationPolicyRequest,
} from "./constraint.types";

export class ConstraintDataRepository {
    private getOrganizationId(): string {
        const organization = $app.organization.getOrganization();
        if (!organization) {
            throw new Error("No organization context available");
        }
        return organization.id;
    }

    private getHeaders() {
        return {
            "x-org-id": this.getOrganizationId(),
        };
    }

    // --- Activity Constraints ---

    async getAllActivityConstraints(): Promise<ActivityConstraintResponse[]> {
        return await $app.ajax.get<ActivityConstraintResponse[]>(
            "/api/schedule/constraints/activityConstraint",
            { headers: this.getHeaders() }
        );
    }

    async getActivityConstraintsByActivity(activityId: string): Promise<ActivityConstraintResponse[]> {
        return await $app.ajax.get<ActivityConstraintResponse[]>(
            `/api/schedule/constraints/activityConstraint/by-activity/${activityId}`,
            { headers: this.getHeaders() }
        );
    }

    async createActivityConstraint(request: CreateActivityConstraintRequest): Promise<ActivityConstraintResponse> {
        return await $app.ajax.post<ActivityConstraintResponse>(
            "/api/schedule/constraints/activityConstraint",
            request,
            { headers: this.getHeaders() }
        );
    }

    async updateActivityConstraint(id: string, request: UpdateActivityConstraintRequest): Promise<void> {
        await $app.ajax.patch<void>(
            `/api/schedule/constraints/activityConstraint/${id}`,
            request,
            { headers: this.getHeaders() }
        );
    }

    async deleteActivityConstraint(id: string): Promise<void> {
        await $app.ajax.delete<void>(
            `/api/schedule/constraints/activityConstraint/${id}`,
            { headers: this.getHeaders() }
        );
    }

    // --- User Constraints ---

    async getAllUserConstraints(): Promise<UserConstraintResponse[]> {
        return await $app.ajax.get<UserConstraintResponse[]>(
            "/api/schedule/constraints/userConstraint",
            { headers: this.getHeaders() }
        );
    }

    async getUserConstraintsByPeriod(schedulingPeriodId: string): Promise<UserConstraintResponse[]> {
        return await $app.ajax.get<UserConstraintResponse[]>(
            `/api/schedule/constraints/userConstraint/by-period/${schedulingPeriodId}`,
            { headers: this.getHeaders() }
        );
    }

    async createUserConstraint(request: CreateUserConstraintRequest): Promise<UserConstraintResponse> {
        return await $app.ajax.post<UserConstraintResponse>(
            "/api/schedule/constraints/userConstraint",
            request,
            { headers: this.getHeaders() }
        );
    }

    async updateUserConstraint(id: string, request: UpdateUserConstraintRequest): Promise<void> {
        await $app.ajax.patch<void>(
            `/api/schedule/constraints/userConstraint/${id}`,
            request,
            { headers: this.getHeaders() }
        );
    }

    async deleteUserConstraint(id: string): Promise<void> {
        await $app.ajax.delete<void>(
            `/api/schedule/constraints/userConstraint/${id}`,
            { headers: this.getHeaders() }
        );
    }

    // --- User Preferences ---

    async getAllUserPreferences(): Promise<UserPreferenceResponse[]> {
        return await $app.ajax.get<UserPreferenceResponse[]>(
            "/api/schedule/constraints/preferenceConstraint",
            { headers: this.getHeaders() }
        );
    }

    async createUserPreference(request: CreateUserPreferenceRequest): Promise<UserPreferenceResponse> {
        return await $app.ajax.post<UserPreferenceResponse>(
            "/api/schedule/constraints/preferenceConstraint",
            request,
            { headers: this.getHeaders() }
        );
    }

    async updateUserPreference(userId: string, schedulingPeriodId: string, key: string, request: UpdateUserPreferenceRequest): Promise<void> {
        await $app.ajax.patch<void>(
            `/api/schedule/constraints/preferenceConstraint/${userId}/${schedulingPeriodId}/${key}`,
            request,
            { headers: this.getHeaders() }
        );
    }

    async deleteUserPreference(id: string): Promise<void> {
        await $app.ajax.delete<void>(
            `/api/schedule/constraints/preferenceConstraint/${id}`,
            { headers: this.getHeaders() }
        );
    }

    // --- Organization Policies ---

    async getAllOrganizationPolicies(): Promise<OrganizationPolicyResponse[]> {
        return await $app.ajax.get<OrganizationPolicyResponse[]>(
            "/api/schedule/constraints/policy",
            { headers: this.getHeaders() }
        );
    }

    async createOrganizationPolicy(request: CreateOrganizationPolicyRequest): Promise<OrganizationPolicyResponse> {
        return await $app.ajax.post<OrganizationPolicyResponse>(
            "/api/schedule/constraints/policy",
            request,
            { headers: this.getHeaders() }
        );
    }

    async updateOrganizationPolicy(id: string, request: UpdateOrganizationPolicyRequest): Promise<void> {
        await $app.ajax.patch<void>(
            `/api/schedule/constraints/policy/${id}`,
            request,
            { headers: this.getHeaders() }
        );
    }

    async deleteOrganizationPolicy(id: string): Promise<void> {
        await $app.ajax.delete<void>(
            `/api/schedule/constraints/policy/${id}`,
            { headers: this.getHeaders() }
        );
    }
}

export const constraintDataRepository = new ConstraintDataRepository();
