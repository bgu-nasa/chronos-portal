import React from "react";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

export function ResourceNotifications() {
    return <Notifications position="top-right" zIndex={1000} />;
}
