/**
 * useRegister hook
 * Provides organization onboarding/registration functionality with loading and error states
 */

import { useState } from "react";
import {
    authDataRepository,
    type RegisterRequest,
} from "@/modules/auth/src/data";

export interface UseRegisterResult {
    register: (request: RegisterRequest) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
}

/**
 * Custom hook for organization registration/onboarding
 * Handles registration state, loading, and error management
 *
 * @returns Register function and state
 *
 * @example
 * ```tsx
 * const { register, isLoading, error } = useRegister();
 *
 * const handleSubmit = async (e) => {
 *   e.preventDefault();
 *   await register({
 *     AdminUser: { Email, FirstName, LastName, Password },
 *     OrganizationName,
 *     Plan
 *   });
 *   // Navigate on success
 * };
 * ```
 */
export function useRegister(): UseRegisterResult {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (request: RegisterRequest): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            await authDataRepository.onboard(request);
        } catch (err: any) {
            const errorMessage =
                err.message || "Registration failed. Please try again.";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => setError(null);

    return {
        register,
        isLoading,
        error,
        clearError,
    };
}
