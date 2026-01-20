/**
 * Resource hooks for Schedule Module
 * React hooks for fetching resources for assignment dropdowns
 */

import { useState, useEffect, useCallback } from "react";
import { resourceDataRepository } from "@/modules/schedule/src/data/resource-data-repository";
import type { ResourceResponse } from "@/modules/schedule/src/data/resource.types";

/**
 * Hook for fetching all resources
 */
export function useResources() {
    const [resources, setResources] = useState<ResourceResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchResources = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await resourceDataRepository.getAllResources();
            setResources(data);
        } catch (err) {
            let errorMessage = "Failed to fetch resources";
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            $app.logger.error("Error fetching resources:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch on mount
    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    return {
        resources,
        isLoading,
        error,
        refetch: fetchResources,
    };
}
