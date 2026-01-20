/**
 * ResourceType data types
 * Matches the backend ResourceTypeResponse, CreateResourceTypeRequest, and UpdateResourceTypeRequest contracts
 */

/**
 * ResourceType response contract from API
 */
export interface ResourceTypeResponse {
    id: string; // Guid from C#
    organizationId: string; // Guid from C#
    type: string;
}

/**
 * ResourceType creation request contract for API
 * Note: Backend generates the ID automatically
 */
export interface CreateResourceTypeRequest {
    organizationId: string; // Guid from C#
    type: string;
}

/**
 * ResourceType update request contract for API
 * Note: ID is not included in update request
 */
export interface UpdateResourceTypeRequest {
    type: string;
}
