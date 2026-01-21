/**
 * Role Store
 * Zustand store for centralized role assignment state management
 * Uses UserRoleAssignmentSummary as the primary data type
 */

import { create } from "zustand";
import { roleDataRepository } from "@/modules/management/src/data/role-data-repository";
import type {
    UserRoleAssignmentSummary,
    RoleAssignmentRequest,
    RoleAssignmentResponse,
} from "@/modules/management/src/data/role.types";

interface RoleStore {
    // State - using UserRoleAssignmentSummary as primary data type
    roleAssignments: UserRoleAssignmentSummary[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchRoleAssignments: () => Promise<void>;
    createRoleAssignment: (
        request: RoleAssignmentRequest,
    ) => Promise<RoleAssignmentResponse | null>;
    removeRoleAssignment: (roleAssignmentId: string) => Promise<boolean>;

    // Utility actions
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useRoleStore = create<RoleStore>((set, get) => ({
    // Initial state
    roleAssignments: [],
    isLoading: false,
    error: null,

    // Fetch role assignments summary
    fetchRoleAssignments: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await roleDataRepository.getRoleAssignmentsSummary();
            set({ roleAssignments: data, isLoading: false });
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch role assignments";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error fetching role assignments:", err);
        }
    },

    // Create a role assignment and refetch
    createRoleAssignment: async (request: RoleAssignmentRequest) => {
        set({ isLoading: true, error: null });
        try {
            const newAssignment =
                await roleDataRepository.createRoleAssignment(request);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchRoleAssignments();

            return newAssignment;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to create role assignment";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error creating role assignment:", err);
            return null;
        }
    },

    // Remove a role assignment and refetch
    removeRoleAssignment: async (roleAssignmentId: string) => {
        set({ isLoading: true, error: null });
        try {
            await roleDataRepository.removeRoleAssignment(roleAssignmentId);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchRoleAssignments();

            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to remove role assignment";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error removing role assignment:", err);
            return false;
        }
    },

    // Utility actions
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
}));
