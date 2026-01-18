/**
 * Constraint data types
 * Matches the backend constraint contracts
 */

/**
 * Activity Constraint
 */
export interface ActivityConstraintResponse {
    id: string;
    activityId: string;
    organizationId: string;
    key: string;
    value: string;
}

export interface CreateActivityConstraintRequest {
    activityId: string;
    key: string;
    value: string;
}

export interface UpdateActivityConstraintRequest {
    key: string;
    value: string;
}

/**
 * User Constraint
 */
export interface UserConstraintResponse {
    id: string;
    userId: string;
    organizationId: string;
    schedulingPeriodId: string;
    key: string;
    value: string;
}

export interface CreateUserConstraintRequest {
    userId: string;
    schedulingPeriodId: string;
    key: string;
    value: string;
}

export interface UpdateUserConstraintRequest {
    key: string;
    value: string;
}

/**
 * User Preference
 */
export interface UserPreferenceResponse {
    id: string;
    userId: string;
    organizationId: string;
    schedulingPeriodId: string;
    key: string;
    value: string;
}

export interface CreateUserPreferenceRequest {
    userId: string;
    schedulingPeriodId: string;
    key: string;
    value: string;
}

export interface UpdateUserPreferenceRequest {
    value: string;
}

/**
 * Organization Policy
 */
export interface OrganizationPolicyResponse {
    id: string;
    organizationId: string;
    schedulingPeriodId: string;
    key: string;
    value: string;
}

export interface CreateOrganizationPolicyRequest {
    schedulingPeriodId: string;
    key: string;
    value: string;
}

export interface UpdateOrganizationPolicyRequest {
    key: string;
    value: string;
}
