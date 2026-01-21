/**
 * Assignment editor store
 * Manages the state for the assignment editor modal
 */

import { create } from "zustand";
import type { AssignmentResponse } from "@/modules/schedule/src/data/assignment.types";

/**
 * Editor mode type
 */
export type EditorMode = "create" | "edit";

/**
 * Assignment editor state interface
 */
interface AssignmentEditorState {
    /**
     * Whether the editor modal is open
     */
    isOpen: boolean;

    /**
     * Current editor mode (create or edit)
     */
    mode: EditorMode;

    /**
     * Assignment being edited (null for create mode)
     */
    assignment: AssignmentResponse | null;

    /**
     * Slot ID for creating new assignment
     */
    slotId: string | null;

    /**
     * Open editor in create mode for a specific slot
     */
    openCreate: (slotId: string) => void;

    /**
     * Open editor in edit mode with an assignment
     */
    openEdit: (assignment: AssignmentResponse) => void;

    /**
     * Close the editor
     */
    close: () => void;
}

/**
 * Assignment editor store
 */
export const useAssignmentEditorStore = create<AssignmentEditorState>(
    (set) => ({
        isOpen: false,
        mode: "create",
        assignment: null,
        slotId: null,

        openCreate: (slotId: string) => {
            set({
                isOpen: true,
                mode: "create",
                assignment: null,
                slotId,
            });
        },

        openEdit: (assignment: AssignmentResponse) => {
            set({
                isOpen: true,
                mode: "edit",
                assignment,
                slotId: assignment.slotId,
            });
        },

        close: () => {
            set({
                isOpen: false,
                assignment: null,
                slotId: null,
            });
        },
    })
);
