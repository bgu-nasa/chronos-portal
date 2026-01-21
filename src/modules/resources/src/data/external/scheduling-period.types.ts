/**
 * Scheduling Period Types
 * Minimal read-only types for displaying scheduling period information
 * Avoids direct dependency on schedule module
 */

/**
 * Scheduling Period for dropdowns and display
 */
export interface SchedulingPeriod {
    id: string;
    name: string;
    fromDate: string;
    toDate: string;
}
