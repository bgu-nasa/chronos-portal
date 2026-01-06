/**
 * Generic confirmation dialog component
 * Provides a reusable confirmation modal for destructive actions
 */

import { Modal, Button, Text, Group } from "@mantine/core";

export interface ConfirmationDialogProps {
    /** Whether the dialog is open */
    opened: boolean;
    /** Callback when dialog is closed without confirmation */
    onClose: () => void;
    /** Callback when user confirms the action */
    onConfirm: () => void;
    /** Dialog title */
    title: string;
    /** Dialog message/content */
    message: string;
    /** Confirm button text (default: "Confirm") */
    confirmText?: string;
    /** Cancel button text (default: "Cancel") */
    cancelText?: string;
    /** Confirm button color (default: "red") */
    confirmColor?: string;
    /** Whether the action is currently loading */
    loading?: boolean;
}

export function ConfirmationDialog({
    opened,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmColor = "red",
    loading = false,
}: ConfirmationDialogProps) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={title}
            centered
            closeOnClickOutside={!loading}
            closeOnEscape={!loading}
        >
            <Text size="sm" mb="lg">
                {message}
            </Text>

            <Group justify="flex-end" gap="sm">
                <Button variant="subtle" onClick={onClose} disabled={loading}>
                    {cancelText}
                </Button>
                <Button
                    color={confirmColor}
                    onClick={onConfirm}
                    loading={loading}
                >
                    {confirmText}
                </Button>
            </Group>
        </Modal>
    );
}
