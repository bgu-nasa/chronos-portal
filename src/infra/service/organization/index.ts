/**
 * Organization service module exports
 */

// Types
export type {
    OrganizationInformation,
    RoleAssignmentResponse,
    DepartmentResponse,
} from "./organization.types";

export { RoleType, type RoleType as RoleTypeValue } from "./organization.types";

// Store
export { useOrganizationStore } from "./organization.store";

// Service
export {
    organizationService,
    useOrganization,
    type IOrganizationService,
} from "./organization.service";

// Data Repository (for internal use or advanced scenarios)
export { organizationDataRepository } from "./organization-data-repository";
