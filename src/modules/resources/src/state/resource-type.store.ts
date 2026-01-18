/**
 * ResourceType Store
 * Zustand store for centralized resource type state management
 */

import { create } from "zustand";
import { $app } from "@/infra/service";
import { resourceTypeDataRepository } from "@/modules/resources/src/data";
import type {
    ResourceTypeResponse,
    CreateResourceTypeRequest,
    UpdateResourceTypeRequest,
} from "@/modules/resources/src/data";

interface ResourceTypeStore {
    // State
    resourceTypes: ResourceTypeResponse[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchResourceTypes: () => Promise<void>;
    createResourceType: (request: CreateResourceTypeRequest) => Promise<ResourceTypeResponse | null>;
    updateResourceType: (resourceTypeId: string, request: UpdateResourceTypeRequest) => Promise<boolean>;
    deleteResourceType: (resourceTypeId: string) => Promise<boolean>;

    // Utility actions
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useResourceTypeStore = create<ResourceTypeStore>((set, get) => ({
    // Initial state
    resourceTypes: [],
    isLoading: false,
    error: null,

    // Fetch all resource types for current organization
    fetchResourceTypes: async () => {
        $app.logger.info("[ResourceTypeStore] fetchResourceTypes called");
        set({ isLoading: true, error: null });
        try {
            const org = $app.organization.getOrganization();
            if (!org) {
                throw new Error("No organization context found");
            }
            $app.logger.info("[ResourceTypeStore] Organization ID", { organizationId: org.id });
            
            const data = await resourceTypeDataRepository.getAllResourceTypes(org.id);
            $app.logger.info("[ResourceTypeStore] Fetched resource types", { count: data.length });
            set({ resourceTypes: data, isLoading: false });
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch resource types";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("[ResourceTypeStore] Error fetching resource types", err);
        }
    },

    // Create a resource type and refetch
    createResourceType: async (request: CreateResourceTypeRequest) => {
        $app.logger.info("[ResourceTypeStore] createResourceType called", { request });
        
        set({ isLoading: true, error: null });
        try {
            const org = $app.organization.getOrganization();
            if (!org) {
                throw new Error("No organization context found");
            }
            $app.logger.info("[ResourceTypeStore] Organization ID", { organizationId: org.id });
            
            const newResourceType = await resourceTypeDataRepository.createResourceType(
                org.id,
                request
            );
            
            $app.logger.info("[ResourceTypeStore] ResourceType created successfully", { resourceTypeId: newResourceType.id });
            set({ isLoading: false });

            // Refetch to update the list
            $app.logger.info("[ResourceTypeStore] Refetching resource types");
            await get().fetchResourceTypes();

            return newResourceType;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to create resource type";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("[ResourceTypeStore] Error creating resource type", err);
            return null;
        }
    },

    // Update a resource type and refetch
    updateResourceType: async (
        resourceTypeId: string,
        request: UpdateResourceTypeRequest
    ) => {
        $app.logger.info("[ResourceTypeStore] updateResourceType called", { resourceTypeId, request });
        
        set({ isLoading: true, error: null });
        try {
            const org = $app.organization.getOrganization();
            if (!org) {
                throw new Error("No organization context found");
            }
            $app.logger.info("[ResourceTypeStore] Organization ID", { organizationId: org.id });
            
            await resourceTypeDataRepository.updateResourceType(
                org.id,
                resourceTypeId,
                request
            );
            
            $app.logger.info("[ResourceTypeStore] ResourceType updated successfully", { resourceTypeId });
            set({ isLoading: false });

            // Refetch to update the list
            $app.logger.info("[ResourceTypeStore] Refetching resource types");
            await get().fetchResourceTypes();

            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to update resource type";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("[ResourceTypeStore] Error updating resource type", err);
            return false;
        }
    },

    // Delete a resource type and refetch
    deleteResourceType: async (resourceTypeId: string) => {
        $app.logger.info("[ResourceTypeStore] deleteResourceType called", { resourceTypeId });
        
        set({ isLoading: true, error: null });
        try {
            const org = $app.organization.getOrganization();
            if (!org) {
                throw new Error("No organization context found");
            }
            $app.logger.info("[ResourceTypeStore] Organization ID", { organizationId: org.id });
            
            await resourceTypeDataRepository.deleteResourceType(org.id, resourceTypeId);
            
            $app.logger.info("[ResourceTypeStore] ResourceType deleted successfully", { resourceTypeId });
            set({ isLoading: false });

            // Refetch to update the list
            $app.logger.info("[ResourceTypeStore] Refetching resource types");
            await get().fetchResourceTypes();

            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to delete resource type";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("[ResourceTypeStore] Error deleting resource type", err);
            return false;
        }
    },

    // Utility actions
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
}));
