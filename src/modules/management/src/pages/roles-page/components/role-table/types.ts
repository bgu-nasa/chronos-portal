/**
 * Role table types
 */

import type { RoleType } from "@/modules/management/src/data/role.types";

/**
 * Row data for the role table
 * Each row represents one scope (org or dept) for a user
 */
export interface RoleTableRow {
    id: string; // Composite key: userEmail-scope-scopeId
    userId: string; // User ID from assignments
    userEmail: string;
    scope: "Organization" | "Department";
    scopeId: string | null; // null for org, departmentId for dept
    scopeName: string; // "Organization" or department name
    roles: RoleType[];
    assignmentIds: string[]; // IDs of the assignments for this scope
}
