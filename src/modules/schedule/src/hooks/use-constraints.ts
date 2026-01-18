/**
 * Constraint hooks
 * React hooks for constraint operations using Zustand store
 */

import { useConstraintStore } from "@/modules/schedule/src/state/constraint.store";

/**
 * Hook for accessing activity constraints state and actions
 */
export function useActivityConstraints() {
    const activityConstraints = useConstraintStore((state) => state.activityConstraints);
    const isLoading = useConstraintStore((state) => state.isLoading);
    const error = useConstraintStore((state) => state.error);
    const fetchActivityConstraints = useConstraintStore((state) => state.fetchActivityConstraints);
    const createActivityConstraint = useConstraintStore((state) => state.createActivityConstraint);
    const updateActivityConstraint = useConstraintStore((state) => state.updateActivityConstraint);
    const deleteActivityConstraint = useConstraintStore((state) => state.deleteActivityConstraint);

    return {
        activityConstraints,
        isLoading,
        error,
        fetchActivityConstraints,
        createActivityConstraint,
        updateActivityConstraint,
        deleteActivityConstraint,
    };
}

/**
 * Hook for accessing user constraints state and actions
 */
export function useUserConstraints() {
    const userConstraints = useConstraintStore((state) => state.userConstraints);
    const isLoading = useConstraintStore((state) => state.isLoading);
    const error = useConstraintStore((state) => state.error);
    const fetchUserConstraints = useConstraintStore((state) => state.fetchUserConstraints);
    const createUserConstraint = useConstraintStore((state) => state.createUserConstraint);
    const updateUserConstraint = useConstraintStore((state) => state.updateUserConstraint);
    const deleteUserConstraint = useConstraintStore((state) => state.deleteUserConstraint);

    return {
        userConstraints,
        isLoading,
        error,
        fetchUserConstraints,
        createUserConstraint,
        updateUserConstraint,
        deleteUserConstraint,
    };
}

/**
 * Hook for accessing user preferences state and actions
 */
export function useUserPreferences() {
    const userPreferences = useConstraintStore((state) => state.userPreferences);
    const isLoading = useConstraintStore((state) => state.isLoading);
    const error = useConstraintStore((state) => state.error);
    const fetchUserPreferences = useConstraintStore((state) => state.fetchUserPreferences);
    const createUserPreference = useConstraintStore((state) => state.createUserPreference);
    const updateUserPreference = useConstraintStore((state) => state.updateUserPreference);
    const deleteUserPreference = useConstraintStore((state) => state.deleteUserPreference);

    return {
        userPreferences,
        isLoading,
        error,
        fetchUserPreferences,
        createUserPreference,
        updateUserPreference,
        deleteUserPreference,
    };
}

/**
 * Hook for accessing organization policies state and actions
 */
export function useOrganizationPolicies() {
    const organizationPolicies = useConstraintStore((state) => state.organizationPolicies);
    const isLoading = useConstraintStore((state) => state.isLoading);
    const error = useConstraintStore((state) => state.error);
    const fetchOrganizationPolicies = useConstraintStore((state) => state.fetchOrganizationPolicies);
    const createOrganizationPolicy = useConstraintStore((state) => state.createOrganizationPolicy);
    const updateOrganizationPolicy = useConstraintStore((state) => state.updateOrganizationPolicy);
    const deleteOrganizationPolicy = useConstraintStore((state) => state.deleteOrganizationPolicy);

    return {
        organizationPolicies,
        isLoading,
        error,
        fetchOrganizationPolicies,
        createOrganizationPolicy,
        updateOrganizationPolicy,
        deleteOrganizationPolicy,
    };
}
