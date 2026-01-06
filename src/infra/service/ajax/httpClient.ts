/**
 * Axios HTTP client with interceptors for authentication and error handling
 */

import axios, { AxiosError } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { tokenService } from "./token.service";
import type { ApiError } from "./types";

// Base URL can be configured via environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// Refresh endpoint (unauthenticated)
const REFRESH_ENDPOINT = "/auth/refresh";

/**
 * Custom request config with auth flag
 */
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _requiresAuth?: boolean;
}

/**
 * Create and configure the Axios instance
 */
function createHttpClient(): AxiosInstance {
    const client = axios.create({
        baseURL: BASE_URL,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Request interceptor: handle token injection and refresh
    client.interceptors.request.use(
        async (config: CustomAxiosRequestConfig) => {
            const requiresAuth = config._requiresAuth ?? true;

            // Skip auth handling for non-authenticated requests
            if (!requiresAuth) {
                return config;
            }

            // Check if token needs refresh
            if (tokenService.hasToken() && tokenService.isTokenStale()) {
                try {
                    await tokenService.refreshToken(async () => {
                        // Call refresh endpoint without auth
                        const response = await client.post(
                            REFRESH_ENDPOINT,
                            {},
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                // @ts-expect-error - Custom property to prevent infinite loop
                                _requiresAuth: false,
                            }
                        );
                        return (response.data as { accessToken: string })
                            .accessToken;
                    });
                } catch (error) {
                    // Token refresh failed, request will proceed without token
                    console.warn("Token refresh failed:", error);
                }
            }

            // Inject token if available
            const token = tokenService.getToken();
            if (token && requiresAuth) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor: normalize errors
    client.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            const apiError: ApiError = {
                status: error.response?.status || 0,
                message: error.response?.data
                    ? (error.response.data as any).message || error.message
                    : error.message,
                details: error.response?.data,
            };

            // Clear token on 401 Unauthorized
            if (apiError.status === 401) {
                tokenService.clearToken();
            }

            return Promise.reject(apiError);
        }
    );

    return client;
}

// Export singleton axios instance
export const httpClient = createHttpClient();
