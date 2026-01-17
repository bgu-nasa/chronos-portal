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
        console.log("🔵 [ActivityStore] fetchActivities called");
        set({ isLoading: true, error: null });
        try {
            const departmentId = get().getDepartmentId();
            console.log("🔵 [ActivityStore] Department ID:", departmentId);
            
            const data = await activityDataRepository.getAllActivities(departmentId);
            console.log("🔵 [ActivityStore] Fetched activities:", data.length);
            set({ activities: data, isLoading: false });
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch activities";
            set({ error: errorMessage, isLoading: false });
            console.error("❌ [ActivityStore] Error fetching activities:", err);
        }
    },

    // Fetch activities by subject
    fetchActivitiesBySubject: async (subjectId: string) => {
        console.log("🔵 [ActivityStore] fetchActivitiesBySubject called");
        console.log("🔵 [ActivityStore] Subject ID:", subjectId);
        set({ isLoading: true, error: null });
        try {
            const departmentId = get().getDepartmentId();
            console.log("🔵 [ActivityStore] Department ID:", departmentId);
            
            const data = await activityDataRepository.getActivitiesBySubject(departmentId, subjectId);
            console.log("🔵 [ActivityStore] Fetched activities:", data.length);
            set({ activities: data, isLoading: false });
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch activities";
            set({ error: errorMessage, isLoading: false });
            console.error("❌ [ActivityStore] Error fetching activities by subject:", err);
        }
    },

    // Create an activity and refetch
    createActivity: async (subjectId: string, request: CreateActivityRequest) => {
        console.log("🟢 [ActivityStore] createActivity called");
        console.log("🟢 [ActivityStore] Subject ID:", subjectId);
        console.log("🟢 [ActivityStore] Request:", JSON.stringify(request, null, 2));
        
        set({ isLoading: true, error: null });
        try {
            const departmentId = get().getDepartmentId();
            console.log("🟢 [ActivityStore] Department ID:", departmentId);
            
            const newActivity = await activityDataRepository.createActivity(
                departmentId,
                subjectId,
                request
            );
            
            console.log("🟢 [ActivityStore] Activity created successfully:", newActivity);
            set({ isLoading: false });

            // Refetch to update the list
            console.log("🟢 [ActivityStore] Refetching activities...");
            await get().fetchActivities();

            return newActivity;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to create activity";
            set({ error: errorMessage, isLoading: false });
            console.error("❌ [ActivityStore] Error creating activity:", err);
            return null;
        }
    },

    // Update an activity and refetch
    updateActivity: async (
        activityId: string,
        request: UpdateActivityRequest
    ) => {
        console.log("🟣 [ActivityStore] updateActivity called");
        console.log("🟣 [ActivityStore] Activity ID:", activityId);
        console.log("🟣 [ActivityStore] Request:", JSON.stringify(request, null, 2));
        
        set({ isLoading: true, error: null });
        try {
            const departmentId = get().getDepartmentId();
            console.log("🟣 [ActivityStore] Department ID:", departmentId);
            
            await activityDataRepository.updateActivity(
                departmentId,
                activityId,
                request
            );
            
            console.log("🟣 [ActivityStore] Activity updated successfully");
            set({ isLoading: false });

            // Refetch to update the list
            console.log("🟣 [ActivityStore] Refetching activities...");
            await get().fetchActivities();

            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to update activity";
            set({ error: errorMessage, isLoading: false });
            console.error("❌ [ActivityStore] Error updating activity:", err);
            return false;
        }
    },

    // Delete an activity and refetch
    deleteActivity: async (activityId: string) => {
        console.log("🗑️ [ActivityStore] deleteActivity called");
        console.log("🗑️ [ActivityStore] Activity ID:", activityId);
        
        set({ isLoading: true, error: null });
        try {
            const departmentId = get().getDepartmentId();
            console.log("🗑️ [ActivityStore] Department ID:", departmentId);
            
            await activityDataRepository.deleteActivity(departmentId, activityId);
            
            console.log("🗑️ [ActivityStore] Activity deleted successfully");
            set({ isLoading: false });

            // Refetch to update the list
            console.log("🗑️ [ActivityStore] Refetching activities...");
            await get().fetchActivities();

            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to delete activity";
            set({ error: errorMessage, isLoading: false });
            console.error("❌ [ActivityStore] Error deleting activity:", err);
            return false;
        }
    },

    // Utility actions
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
}));
