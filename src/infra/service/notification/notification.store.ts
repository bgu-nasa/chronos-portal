/**
 * Notification store using Zustand
 * Manages ephemeral notifications that are never persisted
 */

import { create } from "zustand";
import type { Notification } from "./notification.types";

interface NotificationStore {
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
}

/**
 * Zustand store for managing notifications
 * All notifications are ephemeral and stored only in memory
 */
export const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: [],

    addNotification: (notification) =>
        set((state) => ({
            notifications: [...state.notifications, notification],
        })),

    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),

    clearNotifications: () => set({ notifications: [] }),
}));
