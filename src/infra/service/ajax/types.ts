/**
 * Core types for the Ajax service layer
 */

/**
 * Stored token model with issuance timestamp
 */
export interface StoredToken {
    token: string;
    issuedAt: number; // Date.now()
}

/**
 * Normalized API error shape
 */
export interface ApiError {
    status: number;
    message: string;
    details?: unknown;
}

/**
 * Request configuration options
 */
export interface AjaxRequestConfig {
    /**
     * Whether to include authentication token
     * @default true
     */
    auth?: boolean;
}

/**
 * Public Ajax service interface
 */
export interface IAjaxService {
    get<T>(url: string, config?: AjaxRequestConfig): Promise<T>;
    post<T>(
        url: string,
        body?: unknown,
        config?: AjaxRequestConfig
    ): Promise<T>;
    put<T>(url: string, body?: unknown, config?: AjaxRequestConfig): Promise<T>;
    patch<T>(
        url: string,
        body?: unknown,
        config?: AjaxRequestConfig
    ): Promise<T>;
    delete<T>(url: string, config?: AjaxRequestConfig): Promise<T>;
}
