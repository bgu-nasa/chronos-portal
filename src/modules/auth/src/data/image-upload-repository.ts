/**
 * Image upload data repository
 * Uses imgbb.com free API for image hosting
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
    // Using a public demo key for imgbb - in production, this should be environment variable
    private readonly API_KEY = "demo_key";
    private readonly API_URL = "https://api.imgbb.com/1/upload";

    /**
     * Upload an image file
     * @param file - Image file to upload
     * @returns Image URL and display URL
     */
    async uploadImage(file: File): Promise<ImageUploadResponse> {
        try {
            // Convert file to base64
            const base64 = await this.fileToBase64(file);

            // Create form data
            const formData = new FormData();
            formData.append("key", this.API_KEY);
            formData.append("image", base64.split(",")[1]); // Remove data:image/...;base64, prefix

            // Upload to imgbb
            const response = await fetch(
                `${this.API_URL}?key=${this.API_KEY}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("Failed to upload image");
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error?.message || "Upload failed");
            }

            return {
                url: data.data.url,
                displayUrl: data.data.display_url || data.data.url,
            };
        } catch (error) {
            console.error("Error uploading image:", error);
            throw new Error("Failed to upload image. Please try again.");
        }
    }

    /**
     * Convert file to base64 string
     * @param file - File to convert
     * @returns Base64 encoded string
     */
    private fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
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
