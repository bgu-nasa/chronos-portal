/**
 * Department Types
 * Minimal read-only types for displaying department information
 * Avoids direct dependency on management module
 */

/**
 * Department for dropdowns and display
 */
export interface Department {
    id: string;
    name: string;
}
