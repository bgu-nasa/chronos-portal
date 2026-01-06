/**
 * Organization types
 * Matches the backend C# OrganizationInformation (TenantContext) response contract
 */

/**
 * Role type enum matching backend RoleType
 */
export const RoleType = {
    Administrator: "Administrator",
    UserManager: "UserManager",
    ResourceManager: "ResourceManager",
    Operator: "Operator",
    Viewer: "Viewer",
} as const;

export type RoleType = (typeof RoleType)[keyof typeof RoleType];

/**
 * Department response contract
 */
export interface DepartmentResponse {
    id: string; // Guid from C#
    name: string;
    deleted: boolean;
}

/**
 * Role assignment response contract
 */
export interface RoleAssignmentResponse {
    id: string; // Guid from C#
    userId: string; // Guid from C#
    organizationId: string; // Guid from C#
    departmentId: string | null; // Guid? from C#
    role: RoleType;
}

/**
 * Organization information (Tenant Context) response contract
 */
export interface OrganizationInformation {
    id: string; // Guid from C#
    name: string;
    deleted: boolean;
    deletedTime: string; // DateTime from C# - ISO string
    userEmail: string;
    userFullName: string;
    avatarUrl: string | null;
    userRoles: RoleAssignmentResponse[];
    departments: DepartmentResponse[];
}
