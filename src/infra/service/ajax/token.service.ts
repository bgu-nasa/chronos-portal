/**
 * Token storage and refresh management
 * Handles in-memory token with localStorage persistence
 */

import type { StoredToken } from "./types";

// Token lifetime constants
const TOKEN_TTL = 60 * 60 * 1000; // 1 hour
const REFRESH_MARGIN = 5 * 60 * 1000; // 5 minutes
const TOKEN_STORAGE_KEY = "app_token";

/**
 * Token service for managing authentication tokens
 */
class TokenService {
    private token: StoredToken | null = null;
    private refreshPromise: Promise<void> | null = null;

    constructor() {
        this.loadFromStorage();
    }

    /**
     * Load token from localStorage into memory
     */
    private loadFromStorage(): void {
        try {
            const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
            if (stored) {
                this.token = JSON.parse(stored);
            }
        } catch (error) {
            console.warn("Failed to load token from storage:", error);
            this.clearToken();
        }
    }

    /**
     * Persist token to localStorage
     */
    private saveToStorage(token: StoredToken): void {
        try {
            localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));
        } catch (error) {
            console.warn("Failed to save token to storage:", error);
        }
    }

    /**
     * Get current token if valid
     */
    getToken(): string | null {
        return this.token?.token ?? null;
    }

    /**
     * Set a new token
     */
    setToken(token: string): void {
        this.token = {
            token,
            issuedAt: Date.now(),
        };
        this.saveToStorage(this.token);
    }

    /**
     * Clear token from memory and storage
     */
    clearToken(): void {
        this.token = null;
        this.refreshPromise = null;
        try {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        } catch (error) {
            console.warn("Failed to clear token from storage:", error);
        }
    }

    /**
     * Check if token is stale and needs refresh
     */
    isTokenStale(): boolean {
        if (!this.token) return false;

        const age = Date.now() - this.token.issuedAt;
        return age >= TOKEN_TTL - REFRESH_MARGIN;
    }

    /**
     * Check if token exists
     */
    hasToken(): boolean {
        return this.token !== null;
    }

    /**
     * Refresh token with deduplication
     * Only one refresh request at a time; concurrent calls wait for the same promise
     */
    async refreshToken(refreshFn: () => Promise<string>): Promise<void> {
        // If already refreshing, return existing promise
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        // Create new refresh promise
        this.refreshPromise = (async () => {
            try {
                const newToken = await refreshFn();
                this.setToken(newToken);
            } catch (error) {
                // Clear token on refresh failure
                this.clearToken();
                throw error;
            } finally {
                this.refreshPromise = null;
            }
        })();

        return this.refreshPromise;
    }
}

// Export singleton instance
export const tokenService = new TokenService();
