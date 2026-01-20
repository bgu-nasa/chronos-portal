/**
 * Resource Types for Schedule Module
 * Used for fetching resources from the Resource API
 */

/**
 * Resource Response from API
 * GET /api/resources/resource
 */
export interface ResourceResponse {
    id: string;
    organizationId: string;
    resourceTypeId: string;
    location: string;
    identifier: string;
    capacity: number | null;
}
