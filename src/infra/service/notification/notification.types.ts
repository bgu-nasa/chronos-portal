/**
 * Notification types and interfaces
 */

export type NotificationType =
    | "success"
    | "error"
    | "warning"
    | "loading"
    | "info";

export interface NotificationOptions {
    /**
     * Duration in milliseconds before the notification auto-closes
     * @default 15000 (15 seconds)
     */
    duration?: number;

    /**
     * Whether the notification should auto-close
     * @default true
     */
    autoClose?: boolean;

    /**
     * Unique ID for the notification (useful for updating/removing specific notifications)
     */
    id?: string;

    /**
     * Whether to show a loading indicator
     */
    loading?: boolean;

    /**
     * Custom icon to display
     */
    icon?: React.ReactNode;

    /**
     * Custom color
     */
    color?: string;

    /**
     * Whether the notification can be closed manually
     * @default true
     */
    withCloseButton?: boolean;
}

export interface Notification extends NotificationOptions {
    id: string;
    type: NotificationType;
    title: string;
    message?: string;
}

export interface INotificationService {
    /**
     * Show a success notification
     * @param title Notification title
     * @param message Optional notification message/body
     * @param options Optional configuration
     */
    showSuccess(
        title: string,
        message?: string,
        options?: NotificationOptions,
    ): string;

    /**
     * Show an error notification
     * @param title Notification title
     * @param message Optional notification message/body
     * @param options Optional configuration
     */
    showError(
        title: string,
        message?: string,
        options?: NotificationOptions,
    ): string;

    /**
     * Show a warning notification
     * @param title Notification title
     * @param message Optional notification message/body
     * @param options Optional configuration
     */
    showWarning(
        title: string,
        message?: string,
        options?: NotificationOptions,
    ): string;

    /**
     * Show a loading notification
     * @param title Notification title
     * @param message Optional notification message/body
     * @param options Optional configuration
     */
    showLoading(
        title: string,
        message?: string,
        options?: NotificationOptions,
    ): string;

    /**
     * Show an info notification
     * @param title Notification title
     * @param message Optional notification message/body
     * @param options Optional configuration
     */
    showInfo(
        title: string,
        message?: string,
        options?: NotificationOptions,
    ): string;

    /**
     * Remove a specific notification by ID
     * @param id Notification ID to remove
     */
    remove(id: string): void;

    /**
     * Remove all notifications
     */
    clear(): void;
}
