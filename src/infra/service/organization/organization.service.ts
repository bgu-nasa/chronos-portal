/**
 * Organization service
 * Provides convenient access to organization state and operations
 * This is the main interface that modules should use to access organization data
 */

import { useOrganizationStore } from "./organization.store";
import type {
    OrganizationInformation,
    RoleAssignmentResponse,
    DepartmentResponse,
    RoleType,
} from "./organization.types";

/**
 * Organization service interface
 * Provides methods to interact with organization state
 */
export interface IOrganizationService {
    /**
     * Get current organization information
     */
    getOrganization: () => OrganizationInformation | null;

    /**
     * Check if organization data is currently loading
     */
    isLoading: () => boolean;

    /**
     * Get current error state
     */
    getError: () => string | null;

    /**
     * Fetch organization information from API
     */
    fetchOrganization: () => Promise<void>;

    /**
     * Clear organization state
     */
    clearOrganization: () => void;

    /**
     * Get all user roles for the current organization
     */
    getUserRoles: () => RoleAssignmentResponse[];

    /**
     * Get active (non-deleted) departments
     */
    getActiveDepartments: () => DepartmentResponse[];

    /**
     * Check if current user has a specific role
     */
    hasRole: (role: RoleType) => boolean;

    /**
     * Check if current user is an administrator
     */
    isAdministrator: () => boolean;

    /**
     * Check if current user is a user manager
     */
    isUserManager: () => boolean;

    /**
     * Check if current user is a resource manager
     */
    isResourceManager: () => boolean;

    /**
     * Check if current user has any management role (admin, user manager, or resource manager)
     */
    isManager: () => boolean;
}

/**
 * Organization service implementation
 */
class OrganizationService implements IOrganizationService {
    getOrganization(): OrganizationInformation | null {
        return useOrganizationStore.getState().organization;
    }

    isLoading(): boolean {
        return useOrganizationStore.getState().isLoading;
    }

    getError(): string | null {
        return useOrganizationStore.getState().error;
    }

    async fetchOrganization(): Promise<void> {
        return useOrganizationStore.getState().fetchOrganization();
    }

    clearOrganization(): void {
        useOrganizationStore.getState().clearOrganization();
    }

    getUserRoles(): RoleAssignmentResponse[] {
        return useOrganizationStore.getState().getUserRoles();
    }

    getActiveDepartments(): DepartmentResponse[] {
        return useOrganizationStore.getState().getActiveDepartments();
    }

    hasRole(role: RoleType): boolean {
        return useOrganizationStore.getState().hasRole(role);
    }

    isAdministrator(): boolean {
        return useOrganizationStore.getState().isAdministrator();
    }

    isUserManager(): boolean {
        return this.hasRole("UserManager");
    }

    isResourceManager(): boolean {
        return this.hasRole("ResourceManager");
    }

    isManager(): boolean {
        return (
            this.isAdministrator() ||
            this.isUserManager() ||
            this.isResourceManager()
        );
    }
}

// Export singleton instance
export const organizationService = new OrganizationService();

/**
 * React hook to use organization state
 * This is the recommended way to access organization data in React components
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { organization, isLoading, fetchOrganization } = useOrganization();
 *
 *   useEffect(() => {
 *     fetchOrganization();
 *   }, []);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (!organization) return <div>No organization</div>;
 *
 *   return <div>{organization.name}</div>;
 * }
 * ```
 */
export function useOrganization() {
    const organization = useOrganizationStore((state) => state.organization);
    const isLoading = useOrganizationStore((state) => state.isLoading);
    const error = useOrganizationStore((state) => state.error);
    const fetchOrganization = useOrganizationStore(
        (state) => state.fetchOrganization
    );
    const clearOrganization = useOrganizationStore(
        (state) => state.clearOrganization
    );
    const getUserRoles = useOrganizationStore((state) => state.getUserRoles);
    const getActiveDepartments = useOrganizationStore(
        (state) => state.getActiveDepartments
    );
    const hasRole = useOrganizationStore((state) => state.hasRole);
    const isAdministrator = useOrganizationStore(
        (state) => state.isAdministrator
    );

    return {
        organization,
        isLoading,
        error,
        fetchOrganization,
        clearOrganization,
        getUserRoles,
        getActiveDepartments,
        hasRole,
        isAdministrator,
    };
}
