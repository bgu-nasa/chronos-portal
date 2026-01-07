/**
 * User data fetching helper
 * Duplicated logic from auth module's user repository for fetching users in organization
 * This allows common components to fetch users without depending on auth module
 */

import type { User } from "./user.types";

/**
 * Get organization ID from the current organization context
 * @throws Error if no organization is loaded
 */
function getOrganizationId(): string {
    const organization = $app.organization.getOrganization();
    if (!organization) {
        throw new Error("No organization context available");
    }
    return organization.id;
}

/**
 * Get headers with organization ID
 */
function getHeaders() {
    return {
        "x-org-id": getOrganizationId(),
    };
}

/**
 * Fetch all users for the current organization
 * @returns Array of users
 */
export async function fetchUsersInOrganization(): Promise<User[]> {
    const response = await $app.ajax.get<User[]>("/api/user", {
        headers: getHeaders(),
    });
    return response;
}
