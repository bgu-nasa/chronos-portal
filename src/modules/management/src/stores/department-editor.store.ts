/**
 * Department editor store
 * Manages the state for the department editor modal
 */

import { create } from "zustand";
import type { DepartmentData } from "@/modules/management/src/pages/departments-page/components/department-table/types";

/**
 * Editor mode type
 */
export type EditorMode = "create" | "edit";

/**
 * Department editor state interface
 */
interface DepartmentEditorState {
    /**
     * Whether the editor modal is open
     */
    isOpen: boolean;

    /**
     * Current editor mode (create or edit)
     */
    mode: EditorMode;

    /**
     * Department being edited (null for create mode)
     */
    department: DepartmentData | null;

    /**
     * Open editor in create mode
     */
    openCreate: () => void;

    /**
     * Open editor in edit mode with a department
     */
    openEdit: (department: DepartmentData) => void;

    /**
     * Close the editor
     */
    close: () => void;
}

/**
 * Department editor store
 */
export const useDepartmentEditorStore = create<DepartmentEditorState>(
    (set) => ({
        isOpen: false,
        mode: "create",
        department: null,

        openCreate: () => {
            set({
                isOpen: true,
                mode: "create",
                department: null,
            });
        },

        openEdit: (department: DepartmentData) => {
            set({
                isOpen: true,
                mode: "edit",
                department,
            });
        },

        close: () => {
            set({
                isOpen: false,
                department: null,
            });
        },
    })
);
