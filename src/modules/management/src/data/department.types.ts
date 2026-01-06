/**
 * Department data types
 * Matches the backend DepartmentResponse and DepartmentRequest contracts
 */

/**
 * Department response contract from API
 */
export interface DepartmentResponse {
    id: string; // Guid from C#
    name: string;
    deleted: boolean;
}

/**
 * Department request contract for API
 */
export interface DepartmentRequest {
    name: string;
}
