/**
 * Validation service for auth module
 * Contains stateless validation functions that return error messages or undefined
 */

const RESERVED_ORGANIZATION_NAMES = ["admin", "system", "root", "api", "app"];

/**
 * Validates email format
 * @param email - Email address to validate
 * @returns Error message if invalid, undefined otherwise
 */
export function validateEmail(email: string): string | undefined {
    if (!email || email.trim() === "") {
        return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Invalid email format";
    }

    return undefined;
}

/**
 * Validates password according to requirements:
 * - Minimum 8 characters
 * - Maximum 128 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - No whitespace
 * @param password - Password to validate
 * @returns Error message if invalid, undefined otherwise
 */
export function validatePassword(password: string): string | undefined {
    if (!password) {
        return "Password is required";
    }

    if (password.length < 8) {
        return "Password must be at least 8 characters long";
    }

    if (password.length > 128) {
        return "Password must not exceed 128 characters";
    }

    if (/\s/.test(password)) {
        return "Password cannot contain whitespace";
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);

    if (!hasUppercase || !hasLowercase || !hasDigit) {
        return "Password must contain uppercase, lowercase, and digit";
    }

    return undefined;
}

/**
 * Validates that two passwords match
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns Error message if they don't match, undefined otherwise
 */
export function validatePasswordMatch(
    password: string,
    confirmPassword: string
): string | undefined {
    if (password !== confirmPassword) {
        return "Passwords do not match";
    }
    return undefined;
}

/**
 * Validates organization name according to requirements:
 * - Minimum 3 characters
 * - Maximum 64 characters
 * - Only alphanumeric, hyphens, underscores, and spaces (not at start/end)
 * - Not a reserved system name
 * @param organizationName - Organization name to validate
 * @returns Error message if invalid, undefined otherwise
 */
export function validateOrganizationName(
    organizationName: string
): string | undefined {
    if (!organizationName || organizationName.trim() === "") {
        return "Organization name is required";
    }

    const trimmed = organizationName.trim();

    if (trimmed.length < 3) {
        return "Organization name must be at least 3 characters";
    }

    if (trimmed.length > 64) {
        return "Organization name must not exceed 64 characters";
    }

    // Check if it starts or ends with whitespace (before trim)
    if (
        organizationName !== trimmed ||
        organizationName.startsWith(" ") ||
        organizationName.endsWith(" ")
    ) {
        return "Organization name cannot start or end with whitespace";
    }

    // Check allowed characters: alphanumeric, hyphens, underscores, and spaces
    const validPattern = /^[a-zA-Z0-9_\-\s]+$/;
    if (!validPattern.test(organizationName)) {
        return "Organization name must contain only letters, numbers, hyphens, underscores, and spaces";
    }

    // Check if it's a reserved name (case-insensitive)
    if (RESERVED_ORGANIZATION_NAMES.includes(trimmed.toLowerCase())) {
        return "This organization name is reserved and cannot be used";
    }

    return undefined;
}

/**
 * Validates first name
 * @param firstName - First name to validate
 * @returns Error message if invalid, undefined otherwise
 */
export function validateFirstName(firstName: string): string | undefined {
    if (!firstName || firstName.trim() === "") {
        return "First name is required";
    }

    if (firstName.trim().length < 2) {
        return "First name must be at least 2 characters";
    }

    return undefined;
}

/**
 * Validates last name
 * @param lastName - Last name to validate
 * @returns Error message if invalid, undefined otherwise
 */
export function validateLastName(lastName: string): string | undefined {
    if (!lastName || lastName.trim() === "") {
        return "Last name is required";
    }

    if (lastName.trim().length < 2) {
        return "Last name must be at least 2 characters";
    }

    return undefined;
}

/**
 * Validates that a required field is not empty
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 * @returns Error message if empty, undefined otherwise
 */
export function validateRequired(
    value: string | null | undefined,
    fieldName: string
): string | undefined {
    if (!value || value.trim() === "") {
        return `${fieldName} is required`;
    }
    return undefined;
}
