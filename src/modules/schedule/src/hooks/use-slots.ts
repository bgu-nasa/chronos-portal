/**
 * Slot hooks
 * React hooks for slot CRUD operations using Zustand store
 */

import { useSlotStore } from "@/modules/schedule/src/state/slot.store";

/**
 * Hook for accessing slots state and actions
 */
export function useSlots() {
    const slots = useSlotStore((state) => state.slots);
    const isLoading = useSlotStore((state) => state.isLoading);
    const error = useSlotStore((state) => state.error);
    const fetchSlots = useSlotStore((state) => state.fetchSlots);
    const clearSlots = useSlotStore((state) => state.clearSlots);

    return {
        slots,
        isLoading,
        error,
        fetchSlots,
        clearSlots,
    };
}

/**
 * Hook for creating a slot
 */
export function useCreateSlot() {
    const createSlot = useSlotStore((state) => state.createSlot);
    const isLoading = useSlotStore((state) => state.isLoading);
    const error = useSlotStore((state) => state.error);
    const clearError = useSlotStore((state) => state.clearError);

    return {
        createSlot,
        isLoading,
        error,
        clearError,
    };
}

/**
 * Hook for updating a slot
 */
export function useUpdateSlot() {
    const updateSlot = useSlotStore((state) => state.updateSlot);
    const isLoading = useSlotStore((state) => state.isLoading);
    const error = useSlotStore((state) => state.error);
    const clearError = useSlotStore((state) => state.clearError);

    return {
        updateSlot,
        isLoading,
        error,
        clearError,
    };
}

/**
 * Hook for deleting a slot
 */
export function useDeleteSlot() {
    const deleteSlot = useSlotStore((state) => state.deleteSlot);
    const isLoading = useSlotStore((state) => state.isLoading);
    const error = useSlotStore((state) => state.error);

    return {
        deleteSlot,
        isLoading,
        error,
    };
}
