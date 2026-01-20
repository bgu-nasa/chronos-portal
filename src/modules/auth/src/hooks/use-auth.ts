/**
 * Auth hooks
 * React hooks for authentication operations
 */

import { useState } from "react";
import { authDataRepository } from "@/modules/auth/src/data/auth-data-repository";
import type { PasswordUpdateRequest } from "@/modules/auth/src/data/auth.types";

/**
 * Hook for updating password
 */
export function useUpdatePassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updatePassword = async (
        request: PasswordUpdateRequest,
    ): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            await authDataRepository.updatePassword(request);
            setIsLoading(false);
            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to update password";
            setError(errorMessage);
            setIsLoading(false);
            console.error("Error updating password:", err);
            return false;
        }
    };

    return {
        updatePassword,
        isLoading,
        error,
    };
}
