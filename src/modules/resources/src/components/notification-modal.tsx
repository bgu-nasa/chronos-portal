import React, { createContext, useState, useCallback } from "react";
import { Modal, Text, Button, Stack, Group } from "@mantine/core";

type NotificationType = "info" | "error" | "warning";

interface NotificationData {
    type: NotificationType;
    title: string;
    message: string;
}

interface NotificationContextType {
    showNotification: (data: NotificationData) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notification, setNotification] = useState<NotificationData | null>(null);
    const [opened, setOpened] = useState(false);

    const showNotification = useCallback((data: NotificationData) => {
        setNotification(data);
        setOpened(true);
    }, []);

    const handleClose = () => {
        setOpened(false);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}

            <Modal
                opened={opened}
                onClose={handleClose}
                title={notification?.title}
                centered
                size="sm"
            >
                <Stack gap="md">
                    <Text size="sm">{notification?.message}</Text>
                    <Group justify="flex-end">
                        <Button onClick={handleClose}>
                            OK
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </NotificationContext.Provider>
    );
}
