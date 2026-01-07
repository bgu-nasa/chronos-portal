/**
 * Logger types and interfaces
 */

export type LogLevel = "log" | "info" | "warn" | "error" | "debug";

export interface LogEntry {
    level: LogLevel;
    timestamp: number;
    message: string;
    data?: unknown[];
}

export interface ILogger {
    /**
     * Log a general message
     */
    log(message: string, ...args: unknown[]): void;

    /**
     * Log an informational message
     */
    info(message: string, ...args: unknown[]): void;

    /**
     * Log a warning message
     */
    warn(message: string, ...args: unknown[]): void;

    /**
     * Log an error message
     */
    error(message: string, ...args: unknown[]): void;

    /**
     * Log a debug message
     */
    debug(message: string, ...args: unknown[]): void;

    /**
     * Manually flush the log queue to Discord
     */
    flush(): Promise<void>;
}

export interface DiscordWebhookPayload {
    content?: string;
    embeds?: DiscordEmbed[];
}

export interface DiscordEmbed {
    title?: string;
    description?: string;
    color?: number;
    fields?: DiscordEmbedField[];
    timestamp?: string;
}

export interface DiscordEmbedField {
    name: string;
    value: string;
    inline?: boolean;
}
