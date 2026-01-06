/**
 * Image upload hook
 * Provides image upload functionality with loading and error states
 */

import { useState } from "react";
import { imageUploadRepository } from "@/modules/auth/src/data/image-upload-repository";

export interface UseImageUploadResult {
    uploadImage: (file: File) => Promise<string | null>;
    isUploading: boolean;
    error: string | null;
    clearError: () => void;
    validateImage: (file: File) => string | undefined;
}

/**
 * Custom hook for image upload
 * Handles image upload state, loading, and error management
 */
export function useImageUpload(): UseImageUploadResult {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = async (file: File): Promise<string | null> => {
        // Validate file first
        const validationError = imageUploadRepository.validateImageFile(file);
        if (validationError) {
            setError(validationError);
            return null;
        }

        setIsUploading(true);
        setError(null);

        try {
            const response = await imageUploadRepository.uploadImage(file);
            setIsUploading(false);
            return response.url;
        } catch (err: any) {
            const errorMessage =
                err.message || "Failed to upload image. Please try again.";
            setError(errorMessage);
            setIsUploading(false);
            return null;
        }
    };

    const validateImage = (file: File): string | undefined => {
        return imageUploadRepository.validateImageFile(file);
    };

    const clearError = () => setError(null);

    return {
        uploadImage,
        isUploading,
        error,
        clearError,
        validateImage,
    };
}
