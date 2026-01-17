/**
 * Slot Store
 * Zustand store for centralized slot state management
 */

import { create } from "zustand";
import { slotDataRepository } from "@/modules/schedule/src/data/slot-data-repository";
import type {
    SlotResponse,
    CreateSlotRequest,
    UpdateSlotRequest,
} from "@/modules/schedule/src/data/slot.types";

interface SlotStore {
    // State
    slots: SlotResponse[];
    currentSchedulingPeriodId: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchSlots: (schedulingPeriodId: string) => Promise<void>;
    createSlot: (request: CreateSlotRequest) => Promise<SlotResponse | null>;
    updateSlot: (slotId: string, request: UpdateSlotRequest) => Promise<boolean>;
    deleteSlot: (slotId: string) => Promise<boolean>;

    // Utility actions
    setError: (error: string | null) => void;
    clearError: () => void;
    clearSlots: () => void;
}

export const useSlotStore = create<SlotStore>((set, get) => ({
    // Initial state
    slots: [],
    currentSchedulingPeriodId: null,
    isLoading: false,
    error: null,

    // Fetch all slots for a period
    fetchSlots: async (schedulingPeriodId: string) => {
        set({ isLoading: true, error: null, currentSchedulingPeriodId: schedulingPeriodId });
        try {
            const data = await slotDataRepository.getSlots(schedulingPeriodId);
            set({ slots: data, isLoading: false });
        } catch (err) {
            let errorMessage = "Failed to fetch slots";
            if (err && typeof err === "object" && "status" in err && "message" in err) {
                const apiError = err as { status: number; message: string };
                errorMessage = apiError.status
                    ? `Error ${apiError.status}: ${apiError.message}`
                    : apiError.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error fetching slots:", err);
        }
    },

    // Create a slot and refetch
    createSlot: async (request: CreateSlotRequest) => {
        set({ isLoading: true, error: null });
        try {
            const newSlot = await slotDataRepository.createSlot(request);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchSlots(request.schedulingPeriodId);

            return newSlot;
        } catch (err) {
            let errorMessage = "Failed to create slot";
            if (err && typeof err === "object" && "status" in err && "message" in err) {
                const apiError = err as { status: number; message: string };
                errorMessage = apiError.status
                    ? `Error ${apiError.status}: ${apiError.message}`
                    : apiError.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error creating slot:", err);
            return null;
        }
    },

    // Update a slot and refetch
    updateSlot: async (slotId: string, request: UpdateSlotRequest) => {
        const { currentSchedulingPeriodId } = get();
        if (!currentSchedulingPeriodId) {
            set({ error: "No scheduling period selected" });
            return false;
        }

        set({ isLoading: true, error: null });
        try {
            await slotDataRepository.updateSlot(slotId, request);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchSlots(currentSchedulingPeriodId);

            return true;
        } catch (err) {
            let errorMessage = "Failed to update slot";
            if (err && typeof err === "object" && "status" in err && "message" in err) {
                const apiError = err as { status: number; message: string };
                errorMessage = apiError.status
                    ? `Error ${apiError.status}: ${apiError.message}`
                    : apiError.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error updating slot:", err);
            return false;
        }
    },

    // Delete a slot and refetch
    deleteSlot: async (slotId: string) => {
        const { currentSchedulingPeriodId } = get();
        if (!currentSchedulingPeriodId) {
            set({ error: "No scheduling period selected" });
            return false;
        }

        set({ isLoading: true, error: null });
        try {
            await slotDataRepository.deleteSlot(slotId);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchSlots(currentSchedulingPeriodId);

            return true;
        } catch (err) {
            let errorMessage = "Failed to delete slot";
            if (err && typeof err === "object" && "status" in err && "message" in err) {
                const apiError = err as { status: number; message: string };
                errorMessage = apiError.status
                    ? `Error ${apiError.status}: ${apiError.message}`
                    : apiError.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error deleting slot:", err);
            return false;
        }
    },

    // Utility actions
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
    clearSlots: () => set({ slots: [], error: null, currentSchedulingPeriodId: null }),
}));
