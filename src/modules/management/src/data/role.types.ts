/**
 * Role types
 * TypeScript types for role assignment API contracts
 */

/**
 * Role types matching backend RoleType enum
 */
export type RoleType =
    | "Administrator"
    | "UserManager"
    | "ResourceManager"
    | "Operator"
    | "Viewer";

/**
 * Role assignment response from API
 * Matches backend: RoleAssignmentResponse(Guid Id, Guid UserId, Guid OrganizationId, Guid? DepartmentId, RoleType Role)
 */
export interface RoleAssignmentResponse {
    id: string;
    userId: string;
    organizationId: string;
    departmentId: string | null;
    role: RoleType;
}

/**
 * User role assignment summary
 * Contains user email and all their role assignments
 */
export interface UserRoleAssignmentSummary {
    userEmail: string;
    assignments: RoleAssignmentResponse[];
}

/**
 * Role assignment request for creating new assignments
 * Matches backend: RoleAssignmentRequest(Guid? DepartmentId, Guid UserId, RoleType Role)
 */
export interface RoleAssignmentRequest {
    departmentId: string | null;
    userId: string;
    role: RoleType;
}
