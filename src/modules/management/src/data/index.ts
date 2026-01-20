/**
 * Management module data layer exports
 */

export { departmentDataRepository } from "@/modules/management/src/data/department-data-repository";
export type {
    DepartmentResponse,
    DepartmentRequest,
} from "@/modules/management/src/data/department.types";

export { roleDataRepository } from "@/modules/management/src/data/role-data-repository";
export type {
    RoleAssignmentResponse,
    UserRoleAssignmentSummary,
    RoleAssignmentRequest,
    RoleType,
} from "@/modules/management/src/data/role.types";

export { organizationDataRepository } from "@/modules/management/src/data/organization-data-repository";
