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
import type { ApiError } from "@/infra/service/ajax/types";

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
            const apiError = err as ApiError;
            const errorMessage =
                apiError.message || "Failed to fetch departments";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error fetching departments:", err);
        }
    },

    // Create a department and refetch
    createDepartment: async (request: DepartmentRequest) => {
        set({ isLoading: true, error: null });
        const loadingNotification = $app.notifications.showLoading(
            "Creating department...",
        );
        try {
            const newDepartment =
                await departmentDataRepository.createDepartment(request);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchDepartments();

            $app.notifications.remove(loadingNotification);
            $app.notifications.showSuccess("Department created successfully");
            return newDepartment;
        } catch (err) {
            const apiError = err as ApiError;
            const errorMessage =
                apiError.message || "Failed to create department";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error creating department:", err);
            $app.notifications.remove(loadingNotification);
            $app.notifications.showError(
                "Failed to create department",
                apiError.details ? String(apiError.details) : undefined,
            );
            return null;
        }
    },

    // Update a department and refetch
    updateDepartment: async (
        departmentId: string,
        request: DepartmentRequest,
    ) => {
        set({ isLoading: true, error: null });
        const loadingNotification = $app.notifications.showLoading(
            "Updating department...",
        );
        try {
            await departmentDataRepository.updateDepartment(
                departmentId,
                request,
            );
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchDepartments();

            $app.notifications.remove(loadingNotification);
            $app.notifications.showSuccess("Department updated successfully");
            return true;
        } catch (err) {
            const apiError = err as ApiError;
            const errorMessage =
                apiError.message || "Failed to update department";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error updating department:", err);
            $app.notifications.remove(loadingNotification);
            $app.notifications.showError(
                "Failed to update department",
                apiError.details ? String(apiError.details) : undefined,
            );
            return false;
        }
    },

    // Delete a department and refetch
    deleteDepartment: async (departmentId: string) => {
        set({ isLoading: true, error: null });
        const loadingNotification = $app.notifications.showLoading(
            "Deleting department...",
        );
        try {
            await departmentDataRepository.deleteDepartment(departmentId);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchDepartments();

            $app.notifications.remove(loadingNotification);
            $app.notifications.showSuccess("Department deleted successfully");
            return true;
        } catch (err) {
            const apiError = err as ApiError;
            const errorMessage =
                apiError.message || "Failed to delete department";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error deleting department:", err);
            $app.notifications.remove(loadingNotification);
            $app.notifications.showError(
                "Failed to delete department",
                apiError.details ? String(apiError.details) : undefined,
            );
            return false;
        }
    },

    // Restore a department and refetch
    restoreDepartment: async (departmentId: string) => {
        set({ isLoading: true, error: null });
        const loadingNotification = $app.notifications.showLoading(
            "Restoring department...",
        );
        try {
            await departmentDataRepository.restoreDepartment(departmentId);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchDepartments();

            $app.notifications.remove(loadingNotification);
            $app.notifications.showSuccess("Department restored successfully");
            return true;
        } catch (err) {
            const apiError = err as ApiError;
            const errorMessage =
                apiError.message || "Failed to restore department";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error restoring department:", err);
            $app.notifications.remove(loadingNotification);
            $app.notifications.showError(
                "Failed to restore department",
                apiError.details ? String(apiError.details) : undefined,
            );
            return false;
        }
    },

    // Utility actions
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
}));
