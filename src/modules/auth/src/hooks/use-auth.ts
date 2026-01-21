/**
 * Auth hooks
 * React hooks for authentication operations
 */

import { useState } from "react";
import { authDataRepository } from "@/modules/auth/src/data/auth-data-repository";
import type { PasswordUpdateRequest } from "@/modules/auth/src/data/auth.types";
import type { ApiError } from "@/infra/service/ajax/types";

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
        const loadingNotification = $app.notifications.showLoading(
            "Updating password...",
        );
        try {
            await authDataRepository.updatePassword(request);
            setIsLoading(false);
            $app.notifications.remove(loadingNotification);
            $app.notifications.showSuccess("Password updated successfully");
            return true;
        } catch (err) {
            const apiError = err as ApiError;
            const errorMessage =
                apiError.message || "Failed to update password";
            setError(errorMessage);
            setIsLoading(false);
            $app.logger.error("Error updating password:", err);
            $app.notifications.remove(loadingNotification);
            $app.notifications.showError(
                "Failed to update password",
                apiError.details ? String(apiError.details) : undefined,
            );
            return false;
        }
    };

    return {
        updatePassword,
        isLoading,
        error,
    };
}
