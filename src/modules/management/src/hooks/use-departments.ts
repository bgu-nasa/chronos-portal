/**
 * Department hooks
 * React hooks for department CRUD operations using Zustand store
 */

import { useDepartmentStore } from "@/modules/management/src/state/department.store";

/**
 * Hook for accessing departments state and actions
 */
export function useDepartments() {
    const departments = useDepartmentStore((state) => state.departments);
    const isLoading = useDepartmentStore((state) => state.isLoading);
    const error = useDepartmentStore((state) => state.error);
    const fetchDepartments = useDepartmentStore(
        (state) => state.fetchDepartments
    );

    return {
        departments,
        isLoading,
        error,
        fetchDepartments,
    };
}

/**
 * Hook for creating a department
 */
export function useCreateDepartment() {
    const createDepartment = useDepartmentStore(
        (state) => state.createDepartment
    );
    const isLoading = useDepartmentStore((state) => state.isLoading);
    const error = useDepartmentStore((state) => state.error);

    return {
        createDepartment,
        isLoading,
        error,
    };
}

/**
 * Hook for updating a department
 */
export function useUpdateDepartment() {
    const updateDepartment = useDepartmentStore(
        (state) => state.updateDepartment
    );
    const isLoading = useDepartmentStore((state) => state.isLoading);
    const error = useDepartmentStore((state) => state.error);

    return {
        updateDepartment,
        isLoading,
        error,
    };
}

/**
 * Hook for deleting a department
 */
export function useDeleteDepartment() {
    const deleteDepartment = useDepartmentStore(
        (state) => state.deleteDepartment
    );
    const isLoading = useDepartmentStore((state) => state.isLoading);
    const error = useDepartmentStore((state) => state.error);

    return {
        deleteDepartment,
        isLoading,
        error,
    };
}

/**
 * Hook for restoring a department
 */
export function useRestoreDepartment() {
    const restoreDepartment = useDepartmentStore(
        (state) => state.restoreDepartment
    );
    const isLoading = useDepartmentStore((state) => state.isLoading);
    const error = useDepartmentStore((state) => state.error);

    return {
        restoreDepartment,
        isLoading,
        error,
    };
}
