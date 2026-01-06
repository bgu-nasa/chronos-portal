/**
 * Role hooks
 * React hooks for role assignment CRUD operations using Zustand store
 * Abstracts UserRoleAssignment operations from UI elements
 */

import { useRoleStore } from "@/modules/management/src/state/role.store";

/**
 * Hook for accessing role assignments state and actions
 * Returns UserRoleAssignmentSummary data (grouped by user)
 */
export function useRoleAssignments() {
    const roleAssignments = useRoleStore((state) => state.roleAssignments);
    const isLoading = useRoleStore((state) => state.isLoading);
    const error = useRoleStore((state) => state.error);
    const fetchRoleAssignments = useRoleStore(
        (state) => state.fetchRoleAssignments
    );

    return {
        roleAssignments,
        isLoading,
        error,
        fetchRoleAssignments,
    };
}

/**
 * Hook for creating a role assignment
 * Automatically triggers fetch to update state after creation
 */
export function useCreateRoleAssignment() {
    const createRoleAssignment = useRoleStore(
        (state) => state.createRoleAssignment
    );
    const isLoading = useRoleStore((state) => state.isLoading);
    const error = useRoleStore((state) => state.error);

    return {
        createRoleAssignment,
        isLoading,
        error,
    };
}

/**
 * Hook for removing a role assignment
 * Automatically triggers fetch to update state after removal
 */
export function useRemoveRoleAssignment() {
    const removeRoleAssignment = useRoleStore(
        (state) => state.removeRoleAssignment
    );
    const isLoading = useRoleStore((state) => state.isLoading);
    const error = useRoleStore((state) => state.error);

    return {
        removeRoleAssignment,
        isLoading,
        error,
    };
}
