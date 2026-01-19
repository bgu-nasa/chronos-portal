import { useContext } from "react";
import { NotificationContext } from "../components/notification-modal";

export function useNotification() {
    const context = useContext(NotificationContext);
    
    if (!context) {
        throw new Error("useNotification must be used within NotificationProvider");
    }

    const showInfo = (message: string, title: string = "Info") => {
        context.showNotification({ type: "info", title, message });
    };

    const showError = (message: string, title: string = "Error") => {
        context.showNotification({ type: "error", title, message });
    };

    const showWarning = (message: string, title: string = "Warning") => {
        context.showNotification({ type: "warning", title, message });
    };

    return {
        showInfo,
        showError,
        showWarning,
    };
}
