/**
 * Assignment Store
 * Zustand store for centralized assignment state management
 */

import { create } from "zustand";
import { assignmentDataRepository } from "@/modules/schedule/src/data/assignment-data-repository";
import type {
    AssignmentResponse,
    CreateAssignmentRequest,
    UpdateAssignmentRequest,
} from "@/modules/schedule/src/data/assignment.types";

interface AssignmentStore {
    // State
    assignments: AssignmentResponse[];
    currentSlotId: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchAssignments: (slotId: string) => Promise<void>;
    createAssignment: (request: CreateAssignmentRequest) => Promise<AssignmentResponse | null>;
    updateAssignment: (assignmentId: string, request: UpdateAssignmentRequest) => Promise<boolean>;
    deleteAssignment: (assignmentId: string) => Promise<boolean>;

    // Utility actions
    setError: (error: string | null) => void;
    clearError: () => void;
    clearAssignments: () => void;
}

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
    // Initial state
    assignments: [],
    currentSlotId: null,
    isLoading: false,
    error: null,

    // Fetch all assignments for a slot
    fetchAssignments: async (slotId: string) => {
        set({ isLoading: true, error: null, currentSlotId: slotId });
        try {
            const data = await assignmentDataRepository.getAssignmentsBySlot(slotId);
            set({ assignments: data, isLoading: false });
        } catch (err) {
            let errorMessage = "Failed to fetch assignments";
            if (err && typeof err === "object" && "status" in err && "message" in err) {
                const apiError = err as { status: number; message: string };
                errorMessage = apiError.status
                    ? `Error ${apiError.status}: ${apiError.message}`
                    : apiError.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error fetching assignments:", err);
        }
    },

    // Create an assignment and refetch
    createAssignment: async (request: CreateAssignmentRequest) => {
        set({ isLoading: true, error: null });
        try {
            const newAssignment = await assignmentDataRepository.createAssignment(request);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchAssignments(request.slotId);

            return newAssignment;
        } catch (err) {
            let errorMessage = "Failed to create assignment";
            if (err && typeof err === "object" && "status" in err && "message" in err) {
                const apiError = err as { status: number; message: string };
                errorMessage = apiError.status
                    ? `Error ${apiError.status}: ${apiError.message}`
                    : apiError.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error creating assignment:", err);
            return null;
        }
    },

    // Update an assignment and refetch
    updateAssignment: async (assignmentId: string, request: UpdateAssignmentRequest) => {
        const { currentSlotId } = get();
        if (!currentSlotId) {
            set({ error: "No slot selected" });
            return false;
        }

        set({ isLoading: true, error: null });
        try {
            await assignmentDataRepository.updateAssignment(assignmentId, request);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchAssignments(currentSlotId);

            return true;
        } catch (err) {
            let errorMessage = "Failed to update assignment";
            if (err && typeof err === "object" && "status" in err && "message" in err) {
                const apiError = err as { status: number; message: string };
                errorMessage = apiError.status
                    ? `Error ${apiError.status}: ${apiError.message}`
                    : apiError.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error updating assignment:", err);
            return false;
        }
    },

    // Delete an assignment and refetch
    deleteAssignment: async (assignmentId: string) => {
        const { currentSlotId } = get();
        if (!currentSlotId) {
            set({ error: "No slot selected" });
            return false;
        }

        set({ isLoading: true, error: null });
        try {
            await assignmentDataRepository.deleteAssignment(assignmentId);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchAssignments(currentSlotId);

            return true;
        } catch (err) {
            let errorMessage = "Failed to delete assignment";
            if (err && typeof err === "object" && "status" in err && "message" in err) {
                const apiError = err as { status: number; message: string };
                errorMessage = apiError.status
                    ? `Error ${apiError.status}: ${apiError.message}`
                    : apiError.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error deleting assignment:", err);
            return false;
        }
    },

    // Utility actions
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
    clearAssignments: () => set({ assignments: [], error: null, currentSlotId: null }),
}));
