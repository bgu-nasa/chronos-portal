/**
 * Image upload data repository
 * Currently disabled - no working anonymous upload service found
 */

/**
 * Image upload response
 */
export interface ImageUploadResponse {
    url: string;
    displayUrl: string;
}

/**
 * Image upload repository class
 */
export class ImageUploadRepository {
    /**
     * Upload an image file
     * @param file - Image file to upload
     * @returns Image URL and display URL
     */
    async uploadImage(file: File): Promise<ImageUploadResponse> {
        console.log("Image upload is not working right now");
        throw new Error(
            "Image upload service is currently unavailable. Please try again later."
        );
    }

    /**
     * Validate image file
     * @param file - File to validate
     * @returns Error message if invalid, undefined otherwise
     */
    validateImageFile(file: File): string | undefined {
        // Check file type
        const validTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
        ];
        if (!validTypes.includes(file.type)) {
            return "Please upload a valid image file (JPEG, PNG, GIF, or WebP)";
        }

        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            return "Image size must be less than 5MB";
        }

        return undefined;
    }
}

// Export singleton instance
export const imageUploadRepository = new ImageUploadRepository();
