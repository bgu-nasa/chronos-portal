/**
 * Organization state store using Zustand
 * Manages global organization information state
 */

import { create } from "zustand";
import type {
    OrganizationInformation,
    RoleAssignmentResponse,
    DepartmentResponse,
} from "./organization.types";
import { organizationDataRepository } from "./organization-data-repository";

/**
 * Organization store state interface
 */
interface OrganizationState {
    /**
     * Current organization information
     */
    organization: OrganizationInformation | null;

    /**
     * Loading state for async operations
     */
    isLoading: boolean;

    /**
     * Error state
     */
    error: string | null;

    /**
     * Fetch organization information from the API
     */
    fetchOrganization: () => Promise<void>;

    /**
     * Clear organization state (e.g., on logout)
     */
    clearOrganization: () => void;

    /**
     * Get user roles for the current organization
     */
    getUserRoles: () => RoleAssignmentResponse[];

    /**
     * Get active (non-deleted) departments
     */
    getActiveDepartments: () => DepartmentResponse[];

    /**
     * Check if current user has a specific role
     */
    hasRole: (role: string) => boolean;

    /**
     * Check if current user is an administrator
     */
    isAdministrator: () => boolean;
}

/**
 * Organization store
 * Global state management for organization information
 */
export const useOrganizationStore = create<OrganizationState>((set, get) => ({
    organization: null,
    isLoading: false,
    error: null,

    fetchOrganization: async () => {
        set({ isLoading: true, error: null });

        try {
            const organization =
                await organizationDataRepository.getOrganizationInfo();

            // Sort departments so deleted departments are last
            const sortedOrganization = {
                ...organization,
                departments: [...organization.departments].sort((a, b) => {
                    if (a.deleted === b.deleted) return 0;
                    return a.deleted ? 1 : -1;
                }),
            };

            set({ organization: sortedOrganization, isLoading: false });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch organization";
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    clearOrganization: () => {
        set({ organization: null, error: null, isLoading: false });
    },

    getUserRoles: () => {
        const { organization } = get();
        return organization?.userRoles || [];
    },

    getActiveDepartments: () => {
        const { organization } = get();
        return organization?.departments.filter((dept) => !dept.deleted) || [];
    },

    hasRole: (role: string) => {
        const { organization } = get();
        return organization?.userRoles.some((r) => r.role === role) || false;
    },

    isAdministrator: () => {
        const { organization } = get();
        return (
            organization?.userRoles.some((r) => r.role === "Administrator") ||
            false
        );
    },
}));
