/**
 * User Types
 * Minimal read-only types for displaying user information
 * Avoids direct dependency on auth module
 */

/**
 * User for dropdowns and display
 */
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}
