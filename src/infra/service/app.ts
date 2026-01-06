/**
 * Global $app singleton
 * Central access point for cross-cutting application services
 */

import { ajaxService } from "./ajax/ajax.service";
import { tokenService } from "./ajax/token.service";
import type { IAjaxService } from "./ajax/types";

/**
 * Application service container interface
 * Designed for extensibility - future services can be added here
 */
interface IApp {
    /**
     * HTTP client for authenticated and unauthenticated requests
     */
    ajax: IAjaxService;

    /**
     * Token management service
     * Handles authentication token storage, retrieval, and lifecycle
     */
    token: typeof tokenService;

    /**
     * Check if user is authenticated (has a valid token)
     * @returns true if token exists, false otherwise
     */
    isAuthenticated: () => boolean;

    // Future services can be added here:
    // auth: IAuthService;
    // storage: IStorageService;
    // notifications: INotificationService;
}

/**
 * Global application singleton
 * Provides centralized access to all application services
 *
 * Usage:
 * ```ts
 * import { $app } from '@/infra/service';
 *
 * // Check authentication
 * if ($app.isAuthenticated()) {
 *   console.log('User is authenticated');
 * }
 *
 * // Authenticated request
 * const user = await $app.ajax.get<User>('/users/me');
 *
 * // Unauthenticated request
 * const response = await $app.ajax.post<LoginResponse>(
 *   '/auth/login',
 *   { email, password },
 *   { auth: false }
 * );
 * ```
 */
export const $app: IApp = {
    ajax: ajaxService,
    token: tokenService,
    isAuthenticated: () => tokenService.hasToken(),
};
