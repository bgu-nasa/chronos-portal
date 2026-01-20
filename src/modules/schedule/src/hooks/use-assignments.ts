/**
 * Assignment hooks
 * React hooks for assignment CRUD operations using Zustand store
 */

import { useAssignmentStore } from "@/modules/schedule/src/state/assignment.store";

/**
 * Hook for accessing assignments state and actions
 */
export function useAssignments() {
    const assignments = useAssignmentStore((state) => state.assignments);
    const isLoading = useAssignmentStore((state) => state.isLoading);
    const error = useAssignmentStore((state) => state.error);
    const fetchAssignments = useAssignmentStore((state) => state.fetchAssignments);
    const clearAssignments = useAssignmentStore((state) => state.clearAssignments);

    return {
        assignments,
        isLoading,
        error,
        fetchAssignments,
        clearAssignments,
    };
}

/**
 * Hook for creating an assignment
 */
export function useCreateAssignment() {
    const createAssignment = useAssignmentStore((state) => state.createAssignment);
    const isLoading = useAssignmentStore((state) => state.isLoading);
    const error = useAssignmentStore((state) => state.error);
    const clearError = useAssignmentStore((state) => state.clearError);

    return {
        createAssignment,
        isLoading,
        error,
        clearError,
    };
}

/**
 * Hook for updating an assignment
 */
export function useUpdateAssignment() {
    const updateAssignment = useAssignmentStore((state) => state.updateAssignment);
    const isLoading = useAssignmentStore((state) => state.isLoading);
    const error = useAssignmentStore((state) => state.error);
    const clearError = useAssignmentStore((state) => state.clearError);

    return {
        updateAssignment,
        isLoading,
        error,
        clearError,
    };
}

/**
 * Hook for deleting an assignment
 */
export function useDeleteAssignment() {
    const deleteAssignment = useAssignmentStore((state) => state.deleteAssignment);
    const isLoading = useAssignmentStore((state) => state.isLoading);
    const error = useAssignmentStore((state) => state.error);

    return {
        deleteAssignment,
        isLoading,
        error,
    };
}
