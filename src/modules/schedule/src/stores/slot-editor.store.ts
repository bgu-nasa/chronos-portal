/**
 * Slot editor store
 * Manages the state for the slot editor modal
 */

import { create } from "zustand";
import type { SlotResponse } from "@/modules/schedule/src/data/slot.types";

/**
 * Editor mode type
 */
export type EditorMode = "create" | "edit";

/**
 * Slot editor state interface
 */
interface SlotEditorState {
    /**
     * Whether the editor modal is open
     */
    isOpen: boolean;

    /**
     * Current editor mode (create or edit)
     */
    mode: EditorMode;

    /**
     * Slot being edited (null for create mode)
     */
    slot: SlotResponse | null;

    /**
     * Open editor in create mode
     */
    openCreate: () => void;

    /**
     * Open editor in edit mode with a slot
     */
    openEdit: (slot: SlotResponse) => void;

    /**
     * Close the editor
     */
    close: () => void;
}

/**
 * Slot editor store
 */
export const useSlotEditorStore = create<SlotEditorState>(
    (set) => ({
        isOpen: false,
        mode: "create",
        slot: null,

        openCreate: () => {
            set({
                isOpen: true,
                mode: "create",
                slot: null,
            });
        },

        openEdit: (slot: SlotResponse) => {
            set({
                isOpen: true,
                mode: "edit",
                slot,
            });
        },

        close: () => {
            set({
                isOpen: false,
                slot: null,
            });
        },
    })
);
