/**
 * Resource hooks
 * React hooks for resource CRUD operations using Zustand store
 */

import { useResourceStore } from "@/modules/resources/src/state";

/**
 * Hook for accessing resources state and actions
 */
export function useResources() {
    const resources = useResourceStore((state) => state.resources);
    const isLoading = useResourceStore((state) => state.isLoading);
    const error = useResourceStore((state) => state.error);
    const fetchResources = useResourceStore((state) => state.fetchResources);

    return {
        resources,
        isLoading,
        error,
        fetchResources,
    };
}

/**
 * Hook for creating a resource
 */
export function useCreateResource() {
    const createResource = useResourceStore((state) => state.createResource);
    const isLoading = useResourceStore((state) => state.isLoading);
    const error = useResourceStore((state) => state.error);

    return {
        createResource,
        isLoading,
        error,
    };
}

/**
 * Hook for updating a resource
 */
export function useUpdateResource() {
    const updateResource = useResourceStore((state) => state.updateResource);
    const isLoading = useResourceStore((state) => state.isLoading);
    const error = useResourceStore((state) => state.error);

    return {
        updateResource,
        isLoading,
        error,
    };
}

/**
 * Hook for deleting a resource
 */
export function useDeleteResource() {
    const deleteResource = useResourceStore((state) => state.deleteResource);
    const isLoading = useResourceStore((state) => state.isLoading);
    const error = useResourceStore((state) => state.error);

    return {
        deleteResource,
        isLoading,
        error,
    };
}
