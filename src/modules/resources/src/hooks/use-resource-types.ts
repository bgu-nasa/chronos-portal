/**
 * ResourceType hooks
 * React hooks for resource type CRUD operations using Zustand store
 */

import { useResourceTypeStore } from "@/modules/resources/src/state";

/**
 * Hook for accessing resource types state and actions
 */
export function useResourceTypes() {
    const resourceTypes = useResourceTypeStore((state) => state.resourceTypes);
    const isLoading = useResourceTypeStore((state) => state.isLoading);
    const error = useResourceTypeStore((state) => state.error);
    const fetchResourceTypes = useResourceTypeStore((state) => state.fetchResourceTypes);

    return {
        resourceTypes,
        isLoading,
        error,
        fetchResourceTypes,
    };
}

/**
 * Hook for creating a resource type
 */
export function useCreateResourceType() {
    const createResourceType = useResourceTypeStore((state) => state.createResourceType);
    const isLoading = useResourceTypeStore((state) => state.isLoading);
    const error = useResourceTypeStore((state) => state.error);

    return {
        createResourceType,
        isLoading,
        error,
    };
}

/**
 * Hook for updating a resource type
 */
export function useUpdateResourceType() {
    const updateResourceType = useResourceTypeStore((state) => state.updateResourceType);
    const isLoading = useResourceTypeStore((state) => state.isLoading);
    const error = useResourceTypeStore((state) => state.error);

    return {
        updateResourceType,
        isLoading,
        error,
    };
}

/**
 * Hook for deleting a resource type
 */
export function useDeleteResourceType() {
    const deleteResourceType = useResourceTypeStore((state) => state.deleteResourceType);
    const isLoading = useResourceTypeStore((state) => state.isLoading);
    const error = useResourceTypeStore((state) => state.error);

    return {
        deleteResourceType,
        isLoading,
        error,
    };
}
