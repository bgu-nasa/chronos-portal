/**
 * Scheduling Period Store
 * Zustand store for centralized scheduling period state management
 */

import { create } from "zustand";
import { schedulingPeriodDataRepository } from "@/modules/schedule/src/data/scheduling-period-data-repository";
import type {
    SchedulingPeriodResponse,
    CreateSchedulingPeriodRequest,
    UpdateSchedulingPeriodRequest,
} from "@/modules/schedule/src/data/scheduling-period.types";

interface SchedulingPeriodStore {
    // State
    schedulingPeriods: SchedulingPeriodResponse[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchSchedulingPeriods: () => Promise<void>;
    createSchedulingPeriod: (
        request: CreateSchedulingPeriodRequest
    ) => Promise<SchedulingPeriodResponse | null>;
    updateSchedulingPeriod: (
        schedulingPeriodId: string,
        request: UpdateSchedulingPeriodRequest
    ) => Promise<boolean>;
    deleteSchedulingPeriod: (schedulingPeriodId: string) => Promise<boolean>;

    // Utility actions
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useSchedulingPeriodStore = create<SchedulingPeriodStore>((set, get) => ({
    // Initial state
    schedulingPeriods: [],
    isLoading: false,
    error: null,

    // Fetch all scheduling periods
    fetchSchedulingPeriods: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await schedulingPeriodDataRepository.getAllSchedulingPeriods();
            set({ schedulingPeriods: data, isLoading: false });
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch scheduling periods";
            set({ error: errorMessage, isLoading: false });
            console.error("Error fetching scheduling periods:", err);
        }
    },

    // Create a scheduling period and refetch
    createSchedulingPeriod: async (request: CreateSchedulingPeriodRequest) => {
        set({ isLoading: true, error: null });
        try {
            const newPeriod =
                await schedulingPeriodDataRepository.createSchedulingPeriod(request);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchSchedulingPeriods();

            return newPeriod;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to create scheduling period";
            set({ error: errorMessage, isLoading: false });
            console.error("Error creating scheduling period:", err);
            return null;
        }
    },

    // Update a scheduling period and refetch
    updateSchedulingPeriod: async (
        schedulingPeriodId: string,
        request: UpdateSchedulingPeriodRequest
    ) => {
        set({ isLoading: true, error: null });
        try {
            await schedulingPeriodDataRepository.updateSchedulingPeriod(
                schedulingPeriodId,
                request
            );
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchSchedulingPeriods();

            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to update scheduling period";
            set({ error: errorMessage, isLoading: false });
            console.error("Error updating scheduling period:", err);
            return false;
        }
    },

    // Delete a scheduling period and refetch
    deleteSchedulingPeriod: async (schedulingPeriodId: string) => {
        set({ isLoading: true, error: null });
        try {
            await schedulingPeriodDataRepository.deleteSchedulingPeriod(schedulingPeriodId);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchSchedulingPeriods();

            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to delete scheduling period";
            set({ error: errorMessage, isLoading: false });
            console.error("Error deleting scheduling period:", err);
            return false;
        }
    },

    // Utility actions
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
}));
