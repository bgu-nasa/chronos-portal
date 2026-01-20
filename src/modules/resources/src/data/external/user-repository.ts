/**
 * User Repository
 * Read-only repository for fetching user information
 * Used for dropdowns and display purposes in the resources module
 */

import { $app } from "@/infra/service";
import type { User } from "./user.types";

export class UserRepository {
    /**
     * Get organization ID from the current organization context
     */
    private getOrganizationId(): string {
        const organization = $app.organization.getOrganization();
        if (!organization) {
            throw new Error("No organization context available");
        }
        return organization.id;
    }

    /**
     * Get headers with organization ID
     */
    private getHeaders() {
        return {
            "x-org-id": this.getOrganizationId(),
        };
    }

    /**
     * Fetch all users for the current organization
     * @returns Array of users
     */
    async getAll(): Promise<User[]> {
        $app.logger.info("[UserRepository] Fetching all users");
        try {
            const response = await $app.ajax.get<User[]>(
                "/api/auth/user",
                { headers: this.getHeaders() }
            );
            $app.logger.info("[UserRepository] Fetched users", { count: response.length });
            return response;
        } catch (error) {
            $app.logger.error("[UserRepository] Error fetching users:", error);
            throw error;
        }
    }

    /**
     * Fetch a single user by ID
     * @param id - The user ID
     * @returns User
     */
    async getById(id: string): Promise<User> {
        $app.logger.info("[UserRepository] Fetching user", { id });
        try {
            const response = await $app.ajax.get<User>(
                `/api/auth/user/${id}`,
                { headers: this.getHeaders() }
            );
            $app.logger.info("[UserRepository] Fetched user", { id });
            return response;
        } catch (error) {
            $app.logger.error("[UserRepository] Error fetching user:", error);
            throw error;
        }
    }
}

export const userRepository = new UserRepository();
