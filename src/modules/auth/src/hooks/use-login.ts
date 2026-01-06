/**
 * useLogin hook
 * Provides login functionality with loading and error states
 */

import { useState } from "react";
import { authDataRepository } from "@/modules/auth/src/data";

export interface UseLoginResult {
    login: (email: string, password: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
}

/**
 * Custom hook for user login
 * Handles authentication state, loading, and error management
 *
 * @returns Login function and state
 *
 * @example
 * ```tsx
 * const { login, isLoading, error } = useLogin();
 *
 * const handleSubmit = async (e) => {
 *   e.preventDefault();
 *   await login(email, password);
 *   // Navigate on success
 * };
 * ```
 */
export function useLogin(): UseLoginResult {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (email: string, password: string): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            await authDataRepository.login(email, password);
        } catch (err: any) {
            const errorMessage =
                err.message || "Login failed. Please try again.";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => setError(null);

    return {
        login,
        isLoading,
        error,
        clearError,
    };
}
