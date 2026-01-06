/**
 * User types for common components
 * Minimal user information needed for selection components
 */

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
}
