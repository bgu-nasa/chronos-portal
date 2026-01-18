/**
 * Resource Store
 * Zustand store for centralized resource state management
 */

import { create } from "zustand";
import { $app } from "@/infra/service";
import { resourceDataRepository } from "@/modules/resources/src/data";
import type {
    ResourceResponse,
    CreateResourceRequest,
    UpdateResourceRequest,
} from "@/modules/resources/src/data";

interface ResourceStore {
    // State
    resources: ResourceResponse[];
    currentDepartmentId: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setCurrentDepartment: (departmentId: string) => void;
    getDepartmentId: () => string;
    fetchResources: () => Promise<void>;
    createResource: (request: CreateResourceRequest) => Promise<ResourceResponse | null>;
    updateResource: (resourceId: string, request: UpdateResourceRequest) => Promise<boolean>;
    deleteResource: (resourceId: string) => Promise<boolean>;

    // Utility actions
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useResourceStore = create<ResourceStore>((set, get) => ({
    // Initial state
    resources: [],
    currentDepartmentId: null,
    isLoading: false,
    error: null,

    // Set current department
    setCurrentDepartment: (departmentId: string) => {
        set({ currentDepartmentId: departmentId });
    },

    // Helper to get department ID
    getDepartmentId: (): string => {
        const { currentDepartmentId } = get();
        if (!currentDepartmentId) {
            throw new Error("No department context set. Call setCurrentDepartment first.");
        }
        return currentDepartmentId;
    },

    // Fetch all resources
    fetchResources: async () => {
        $app.logger.info("[ResourceStore] fetchResources called");
        set({ isLoading: true, error: null });
        try {
            const departmentId = get().getDepartmentId();
            $app.logger.info("[ResourceStore] Department ID", { departmentId });
            
            const data = await resourceDataRepository.getAllResources(departmentId);
            $app.logger.info("[ResourceStore] Fetched resources", { count: data.length });
            set({ resources: data, isLoading: false });
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch resources";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("[ResourceStore] Error fetching resources", err);
        }
    },

    // Create a resource and refetch
    createResource: async (request: CreateResourceRequest) => {
        $app.logger.info("[ResourceStore] createResource called", { request });
        
        set({ isLoading: true, error: null });
        try {
            const departmentId = get().getDepartmentId();
            $app.logger.info("[ResourceStore] Department ID", { departmentId });
            
            const newResource = await resourceDataRepository.createResource(
                departmentId,
                request
            );
            
            $app.logger.info("[ResourceStore] Resource created successfully", { resourceId: newResource.id });
            set({ isLoading: false });

            // Refetch to update the list
            $app.logger.info("[ResourceStore] Refetching resources");
            await get().fetchResources();

            return newResource;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to create resource";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("[ResourceStore] Error creating resource", err);
            return null;
        }
    },

    // Update a resource and refetch
    updateResource: async (
        resourceId: string,
        request: UpdateResourceRequest
    ) => {
        $app.logger.info("[ResourceStore] updateResource called", { resourceId, request });
        
        set({ isLoading: true, error: null });
        try {
            const departmentId = get().getDepartmentId();
            $app.logger.info("[ResourceStore] Department ID", { departmentId });
            
            await resourceDataRepository.updateResource(
                departmentId,
                resourceId,
                request
            );
            
            $app.logger.info("[ResourceStore] Resource updated successfully", { resourceId });
            set({ isLoading: false });

            // Refetch to update the list
            $app.logger.info("[ResourceStore] Refetching resources");
            await get().fetchResources();

            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to update resource";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("[ResourceStore] Error updating resource", err);
            return false;
        }
    },

    // Delete a resource and refetch
    deleteResource: async (resourceId: string) => {
        $app.logger.info("[ResourceStore] deleteResource called", { resourceId });
        
        set({ isLoading: true, error: null });
        try {
            const departmentId = get().getDepartmentId();
            $app.logger.info("[ResourceStore] Department ID", { departmentId });
            
            await resourceDataRepository.deleteResource(departmentId, resourceId);
            
            $app.logger.info("[ResourceStore] Resource deleted successfully", { resourceId });
            set({ isLoading: false });

            // Refetch to update the list
            $app.logger.info("[ResourceStore] Refetching resources");
            await get().fetchResources();

            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to delete resource";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("[ResourceStore] Error deleting resource", err);
            return false;
        }
    },

    // Utility actions
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
}));
