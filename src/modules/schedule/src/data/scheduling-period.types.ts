/**
 * Scheduling Period data types
 * Matches the backend SchedulingPeriodResponse and request contracts
 */

/**
 * Scheduling Period response contract from API
 */
export interface SchedulingPeriodResponse {
    id: string;
    organizationId: string;
    name: string;
    fromDate: string;
    toDate: string;
}

/**
 * Create Scheduling Period request contract for API
 */
export interface CreateSchedulingPeriodRequest {
    name: string;
    fromDate: string;
    toDate: string;
}

/**
 * Update Scheduling Period request contract for API
 */
export interface UpdateSchedulingPeriodRequest {
    name: string;
    fromDate: string;
    toDate: string;
}
