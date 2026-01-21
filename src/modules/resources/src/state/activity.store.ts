/**
 * Activity Store
 * Zustand store for centralized activity state management
 */

import { create } from "zustand";
import { activityDataRepository } from "@/modules/resources/src/data";
import type {
    ActivityResponse,
    CreateActivityRequest,
    UpdateActivityRequest,
} from "@/modules/resources/src/data";

interface ActivityStore {
    // State
    activities: ActivityResponse[];
    currentDepartmentId: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setCurrentDepartment: (departmentId: string) => void;
    getDepartmentId: () => string;
    fetchActivities: () => Promise<void>;
    fetchActivitiesBySubject: (subjectId: string) => Promise<void>;
    createActivity: (subjectId: string, request: CreateActivityRequest) => Promise<ActivityResponse | null>;
    updateActivity: (activityId: string, request: UpdateActivityRequest) => Promise<boolean>;
    deleteActivity: (activityId: string) => Promise<boolean>;

    // Utility actions
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useActivityStore = create<ActivityStore>((set, get) => ({
    // Initial state
    activities: [],
    currentDepartmentId: null,
    isLoading: false,
    error: null,

    // Set current department
    setCurrentDepartment: (departmentId: string) => {
        set({ currentDepartmentId: departmentId });
    },

    // Helper to get department ID
    getDepartmentId: (): string => {
        const { currentDepartmentId } = get();
        if (!currentDepartmentId) {
            throw new Error("No department context set. Call setCurrentDepartment first.");
        }
        return currentDepartmentId;
    },

    // Fetch all activities
    fetchActivities: async () => {
        $app.logger.info("[ActivityStore] fetchActivities called");
        set({ isLoading: true, error: null });
        try {
            const departmentId = get().getDepartmentId();
            $app.logger.info("[ActivityStore] Department ID:", departmentId);
            
            const data = await activityDataRepository.getAllActivities(departmentId);
            $app.logger.info("[ActivityStore] Fetched activities:", data.length);
            set({ activities: data, isLoading: false });
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch activities";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("[ActivityStore] Error fetching activities:", err);
        }
    },

    // Fetch activities by subject
    fetchActivitiesBySubject: async (subjectId: string) => {
        $app.logger.info("[ActivityStore] fetchActivitiesBySubject called");
        $app.logger.info("[ActivityStore] Subject ID:", subjectId);
        set({ isLoading: true, error: null });
        try {
            const departmentId = get().getDepartmentId();
            $app.logger.info("[ActivityStore] Department ID:", departmentId);
            
            const data = await activityDataRepository.getActivitiesBySubject(departmentId, subjectId);
            $app.logger.info("[ActivityStore] Fetched activities:", data.length);
            set({ activities: data, isLoading: false });
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch activities";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("[ActivityStore] Error fetching activities by subject:", err);
        }
    },

    // Create an activity and refetch
    createActivity: async (subjectId: string, request: CreateActivityRequest) => {
        $app.logger.info("[ActivityStore] createActivity called");
        $app.logger.info("[ActivityStore] Subject ID:", subjectId);
        $app.logger.info("[ActivityStore] Request:", JSON.stringify(request, null, 2));
        
        set({ isLoading: true, error: null });
        try {
            const departmentId = get().getDepartmentId();
            $app.logger.info("[ActivityStore] Department ID:", departmentId);
            
            const newActivity = await activityDataRepository.createActivity(
                departmentId,
                subjectId,
                request
            );
            
            $app.logger.info("[ActivityStore] Activity created successfully:", newActivity);
            set({ isLoading: false });

            // Refetch to update the list
            $app.logger.info("[ActivityStore] Refetching activities...");
            await get().fetchActivities();

            return newActivity;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to create activity";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("[ActivityStore] Error creating activity:", err);
            return null;
        }
    },

    // Update an activity and refetch
    updateActivity: async (
        activityId: string,
        request: UpdateActivityRequest
    ) => {
        $app.logger.info("[ActivityStore] updateActivity called");
        $app.logger.info("[ActivityStore] Activity ID:", activityId);
        $app.logger.info("[ActivityStore] Request:", JSON.stringify(request, null, 2));
        
        set({ isLoading: true, error: null });
        try {
            const departmentId = get().getDepartmentId();
            $app.logger.info("[ActivityStore] Department ID:", departmentId);
            
            await activityDataRepository.updateActivity(
                departmentId,
                activityId,
                request
            );
            
            $app.logger.info("[ActivityStore] Activity updated successfully");
            set({ isLoading: false });

            // Refetch to update the list
            $app.logger.info("[ActivityStore] Refetching activities...");
            await get().fetchActivities();

            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to update activity";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("[ActivityStore] Error updating activity:", err);
            return false;
        }
    },

    // Delete an activity and refetch
    deleteActivity: async (activityId: string) => {
        $app.logger.info("[ActivityStore] deleteActivity called");
        $app.logger.info("[ActivityStore] Activity ID:", activityId);
        
        set({ isLoading: true, error: null });
        try {
            const departmentId = get().getDepartmentId();
            $app.logger.info("[ActivityStore] Department ID:", departmentId);
            
            await activityDataRepository.deleteActivity(departmentId, activityId);
            
            $app.logger.info("[ActivityStore] Activity deleted successfully");
            set({ isLoading: false });

            // Refetch to update the list
            $app.logger.info("[ActivityStore] Refetching activities...");
            await get().fetchActivities();

            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to delete activity";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("[ActivityStore] Error deleting activity:", err);
            return false;
        }
    },

    // Utility actions
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
}));
