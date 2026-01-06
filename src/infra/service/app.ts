/**
 * Global $app singleton
 * Central access point for cross-cutting application services
 */

import { ajaxService } from "./ajax/ajax.service";
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
};
