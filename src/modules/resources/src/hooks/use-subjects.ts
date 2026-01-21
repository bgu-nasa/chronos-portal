/**
 * Subject hooks
 * React hooks for subject CRUD operations using Zustand store
 */

import { useSubjectStore } from "@/modules/resources/src/state";

/**
 * Hook for accessing subjects state and actions
 */
export function useSubjects() {
    const subjects = useSubjectStore((state) => state.subjects);
    const currentDepartmentId = useSubjectStore(
        (state) => state.currentDepartmentId
    );
    const isLoading = useSubjectStore((state) => state.isLoading);
    const error = useSubjectStore((state) => state.error);
    const setCurrentDepartment = useSubjectStore(
        (state) => state.setCurrentDepartment
    );
    const fetchSubjects = useSubjectStore((state) => state.fetchSubjects);
    const clearState = useSubjectStore((state) => state.clearState);

    return {
        subjects,
        currentDepartmentId,
        isLoading,
        error,
        setCurrentDepartment,
        fetchSubjects,
        clearState,
    };
}

/**
 * Hook for creating a subject
 */
export function useCreateSubject() {
    const createSubject = useSubjectStore((state) => state.createSubject);
    const isLoading = useSubjectStore((state) => state.isLoading);
    const error = useSubjectStore((state) => state.error);

    return {
        createSubject,
        isLoading,
        error,
    };
}

/**
 * Hook for updating a subject
 */
export function useUpdateSubject() {
    const updateSubject = useSubjectStore((state) => state.updateSubject);
    const isLoading = useSubjectStore((state) => state.isLoading);
    const error = useSubjectStore((state) => state.error);

    return {
        updateSubject,
        isLoading,
        error,
    };
}

/**
 * Hook for deleting a subject
 */
export function useDeleteSubject() {
    const deleteSubject = useSubjectStore((state) => state.deleteSubject);
    const isLoading = useSubjectStore((state) => state.isLoading);
    const error = useSubjectStore((state) => state.error);

    return {
        deleteSubject,
        isLoading,
        error,
    };
}
