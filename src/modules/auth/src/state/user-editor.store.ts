/**
 * User Editor Store
 * Zustand store for managing user editor drawer state
 */

import { create } from "zustand";
import type { UserResponse } from "@/modules/auth/src/data/user.types";

interface UserEditorStore {
    // State
    isOpen: boolean;
    mode: "create" | "edit";
    editingUser: UserResponse | null;
    generatedPassword: string | null;

    // Actions
    openForCreate: () => void;
    openForEdit: (user: UserResponse) => void;
    close: () => void;
    setGeneratedPassword: (password: string) => void;
    clearGeneratedPassword: () => void;
}

export const useUserEditorStore = create<UserEditorStore>((set) => ({
    // Initial state
    isOpen: false,
    mode: "create",
    editingUser: null,
    generatedPassword: null,

    // Open drawer for creating a new user
    openForCreate: () =>
        set({
            isOpen: true,
            mode: "create",
            editingUser: null,
            generatedPassword: null,
        }),

    // Open drawer for editing an existing user
    openForEdit: (user: UserResponse) =>
        set({
            isOpen: true,
            mode: "edit",
            editingUser: user,
            generatedPassword: null,
        }),

    // Close the drawer
    close: () =>
        set({
            isOpen: false,
            editingUser: null,
            generatedPassword: null,
        }),

    // Set the generated password (for display after creation)
    setGeneratedPassword: (password: string) =>
        set({ generatedPassword: password }),

    // Clear the generated password
    clearGeneratedPassword: () => set({ generatedPassword: null }),
}));
