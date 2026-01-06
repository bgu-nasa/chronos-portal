/**
 * Password generator utility
 * Generates secure passwords that meet validation requirements
 */

/**
 * Generates a random password that meets the validation requirements:
 * - 24 characters long
 * - Contains uppercase letters (A-Z)
 * - Contains lowercase letters (a-z)
 * - Contains digits (0-9)
 * - All alphanumeric characters
 *
 * @returns A randomly generated 24-character alphanumeric password
 */
export function generateSecurePassword(): string {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const allChars = uppercase + lowercase + digits;

    // Ensure at least one of each required character type
    let password = "";

    // Add at least one uppercase
    password += uppercase[Math.floor(Math.random() * uppercase.length)];

    // Add at least one lowercase
    password += lowercase[Math.floor(Math.random() * lowercase.length)];

    // Add at least one digit
    password += digits[Math.floor(Math.random() * digits.length)];

    // Fill the rest with random alphanumeric characters (total 24 chars)
    for (let i = 3; i < 24; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password to randomize the position of required characters
    return shuffleString(password);
}

/**
 * Shuffles a string using Fisher-Yates algorithm
 * @param str - String to shuffle
 * @returns Shuffled string
 */
function shuffleString(str: string): string {
    const arr = str.split("");
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
}
