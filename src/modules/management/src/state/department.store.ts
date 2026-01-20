/**
 * Department Store
 * Zustand store for centralized department state management
 */

import { create } from "zustand";
import { departmentDataRepository } from "@/modules/management/src/data/department-data-repository";
import type {
    DepartmentResponse,
    DepartmentRequest,
} from "@/modules/management/src/data/department.types";

interface DepartmentStore {
    // State
    departments: DepartmentResponse[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchDepartments: () => Promise<void>;
    createDepartment: (
        request: DepartmentRequest,
    ) => Promise<DepartmentResponse | null>;
    updateDepartment: (
        departmentId: string,
        request: DepartmentRequest,
    ) => Promise<boolean>;
    deleteDepartment: (departmentId: string) => Promise<boolean>;
    restoreDepartment: (departmentId: string) => Promise<boolean>;

    // Utility actions
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useDepartmentStore = create<DepartmentStore>((set, get) => ({
    // Initial state
    departments: [],
    isLoading: false,
    error: null,

    // Fetch all departments
    fetchDepartments: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await departmentDataRepository.getAllDepartments();
            set({ departments: data, isLoading: false });
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch departments";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error fetching departments:", err);
        }
    },

    // Create a department and refetch
    createDepartment: async (request: DepartmentRequest) => {
        set({ isLoading: true, error: null });
        try {
            const newDepartment =
                await departmentDataRepository.createDepartment(request);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchDepartments();

            return newDepartment;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to create department";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error creating department:", err);
            return null;
        }
    },

    // Update a department and refetch
    updateDepartment: async (
        departmentId: string,
        request: DepartmentRequest,
    ) => {
        set({ isLoading: true, error: null });
        try {
            await departmentDataRepository.updateDepartment(
                departmentId,
                request,
            );
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchDepartments();

            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to update department";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error updating department:", err);
            return false;
        }
    },

    // Delete a department and refetch
    deleteDepartment: async (departmentId: string) => {
        set({ isLoading: true, error: null });
        try {
            await departmentDataRepository.deleteDepartment(departmentId);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchDepartments();

            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to delete department";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error deleting department:", err);
            return false;
        }
    },

    // Restore a department and refetch
    restoreDepartment: async (departmentId: string) => {
        set({ isLoading: true, error: null });
        try {
            await departmentDataRepository.restoreDepartment(departmentId);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchDepartments();

            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to restore department";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error restoring department:", err);
            return false;
        }
    },

    // Utility actions
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
}));
