/**
 * Activity hooks
 * React hooks for activity CRUD operations using Zustand store
 */

import { useActivityStore } from "@/modules/resources/src/state";

/**
 * Hook for accessing activities state and actions
 */
export function useActivities() {
    const activities = useActivityStore((state) => state.activities);
    const currentDepartmentId = useActivityStore(
        (state) => state.currentDepartmentId
    );
    const isLoading = useActivityStore((state) => state.isLoading);
    const error = useActivityStore((state) => state.error);
    const setCurrentDepartment = useActivityStore(
        (state) => state.setCurrentDepartment
    );
    const fetchActivities = useActivityStore((state) => state.fetchActivities);
    const fetchActivitiesBySubject = useActivityStore(
        (state) => state.fetchActivitiesBySubject
    );

    return {
        activities,
        currentDepartmentId,
        isLoading,
        error,
        setCurrentDepartment,
        fetchActivities,
        fetchActivitiesBySubject,
    };
}

/**
 * Hook for creating an activity
 */
export function useCreateActivity() {
    const createActivity = useActivityStore((state) => state.createActivity);
    const isLoading = useActivityStore((state) => state.isLoading);
    const error = useActivityStore((state) => state.error);

    return {
        createActivity,
        isLoading,
        error,
    };
}

/**
 * Hook for updating an activity
 */
export function useUpdateActivity() {
    const updateActivity = useActivityStore((state) => state.updateActivity);
    const isLoading = useActivityStore((state) => state.isLoading);
    const error = useActivityStore((state) => state.error);

    return {
        updateActivity,
        isLoading,
        error,
    };
}

/**
 * Hook for deleting an activity
 */
export function useDeleteActivity() {
    const deleteActivity = useActivityStore((state) => state.deleteActivity);
    const isLoading = useActivityStore((state) => state.isLoading);
    const error = useActivityStore((state) => state.error);

    return {
        deleteActivity,
        isLoading,
        error,
    };
}
