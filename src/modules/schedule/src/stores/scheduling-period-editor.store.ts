/**
 * Scheduling Period editor store
 * Manages the state for the scheduling period editor modal
 */

import { create } from "zustand";

/**
 * Editor mode type
 */
export type EditorMode = "create" | "edit";

/**
 * Scheduling Period data for table display
 */
export interface SchedulingPeriodData {
    id: string;
    name: string;
    fromDate: string;
    toDate: string;
}

/**
 * Scheduling Period editor state interface
 */
interface SchedulingPeriodEditorState {
    /**
     * Whether the editor modal is open
     */
    isOpen: boolean;

    /**
     * Current editor mode (create or edit)
     */
    mode: EditorMode;

    /**
     * Scheduling period being edited (null for create mode)
     */
    schedulingPeriod: SchedulingPeriodData | null;

    /**
     * Open editor in create mode
     */
    openCreate: () => void;

    /**
     * Open editor in edit mode with a scheduling period
     */
    openEdit: (schedulingPeriod: SchedulingPeriodData) => void;

    /**
     * Close the editor
     */
    close: () => void;
}

/**
 * Scheduling Period editor store
 */
export const useSchedulingPeriodEditorStore = create<SchedulingPeriodEditorState>(
    (set) => ({
        isOpen: false,
        mode: "create",
        schedulingPeriod: null,

        openCreate: () => {
            set({
                isOpen: true,
                mode: "create",
                schedulingPeriod: null,
            });
        },

        openEdit: (schedulingPeriod: SchedulingPeriodData) => {
            set({
                isOpen: true,
                mode: "edit",
                schedulingPeriod,
            });
        },

        close: () => {
            set({
                isOpen: false,
                schedulingPeriod: null,
            });
        },
    })
);
