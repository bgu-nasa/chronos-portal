/**
 * Ajax service - Public API for making HTTP requests
 */

import { httpClient } from "./httpClient";
import type { IAjaxService, AjaxRequestConfig } from "./types";
import type { AxiosRequestConfig } from "axios";

/**
 * Merge custom config with axios config
 */
function buildConfig(
    config?: AjaxRequestConfig
): AxiosRequestConfig & { _requiresAuth?: boolean } {
    const { auth = true, headers, ...rest } = config || {};

    return {
        ...rest,
        headers,
        _requiresAuth: auth,
    } as AxiosRequestConfig & { _requiresAuth?: boolean };
}

/**
 * Ajax service implementation
 */
class AjaxService implements IAjaxService {
    /**
     * Perform GET request
     */
    async get<T>(url: string, config?: AjaxRequestConfig): Promise<T> {
        const response = await httpClient.get<T>(url, buildConfig(config));
        return response.data;
    }

    /**
     * Perform POST request
     */
    async post<T>(
        url: string,
        body?: unknown,
        config?: AjaxRequestConfig
    ): Promise<T> {
        const response = await httpClient.post<T>(
            url,
            body,
            buildConfig(config)
        );
        return response.data;
    }

    /**
     * Perform PUT request
     */
    async put<T>(
        url: string,
        body?: unknown,
        config?: AjaxRequestConfig
    ): Promise<T> {
        const response = await httpClient.put<T>(
            url,
            body,
            buildConfig(config)
        );
        return response.data;
    }

    /**
     * Perform PATCH request
     */
    async patch<T>(
        url: string,
        body?: unknown,
        config?: AjaxRequestConfig
    ): Promise<T> {
        const response = await httpClient.patch<T>(
            url,
            body,
            buildConfig(config)
        );
        return response.data;
    }

    /**
     * Perform DELETE request
     */
    async delete<T>(url: string, config?: AjaxRequestConfig): Promise<T> {
        const response = await httpClient.delete<T>(url, buildConfig(config));
        return response.data;
    }
}

// Export singleton instance
export const ajaxService = new AjaxService();
