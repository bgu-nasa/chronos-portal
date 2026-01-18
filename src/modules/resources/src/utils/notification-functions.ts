import { notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

interface NotificationOptions {
    title?: string;
    message: string;
    autoClose?: number | false;
}

export function showSuccessNotification(options: NotificationOptions) {
    notifications.show({
        title: options.title || "Success",
        message: options.message,
        color: "green",
        autoClose: options.autoClose ?? 4000,
    });
}

export function showErrorNotification(options: NotificationOptions) {
    notifications.show({
        title: options.title || "Error",
        message: options.message,
        color: "red",
        autoClose: options.autoClose ?? 6000,
    });
}

export function showWarningNotification(options: NotificationOptions) {
    notifications.show({
        title: options.title || "Warning",
        message: options.message,
        color: "yellow",
        autoClose: options.autoClose ?? 5000,
    });
}

export function showInfoNotification(options: NotificationOptions) {
    notifications.show({
        title: options.title || "Info",
        message: options.message,
        color: "blue",
        autoClose: options.autoClose ?? 4000,
    });
}
