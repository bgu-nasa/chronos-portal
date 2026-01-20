import { Modal, Button, Group, Text, Stack } from "@mantine/core";

interface TimeRangeSelectionModalProps {
    readonly opened: boolean;
    readonly onClose: () => void;
    readonly onConfirm: () => Promise<void>;
    readonly date: Date;
    readonly startTime: string;
    readonly endTime: string;
    readonly loading?: boolean;
}

export function TimeRangeSelectionModal({
    opened,
    onClose,
    onConfirm,
    date,
    startTime,
    endTime,
    loading = false,
}: TimeRangeSelectionModalProps) {
    const weekdayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dateString = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Set as Unavailable"
            size="md"
        >
            <Stack gap="md">
                <Text>
                    Create a forbidden time range constraint for:
                </Text>
                <Text fw={600}>
                    {weekdayName}, {dateString}
                </Text>
                <Text>
                    {startTime} - {endTime}
                </Text>
                <Group justify="flex-end" mt="xl">
                    <Button variant="subtle" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} loading={loading}>
                        Set as Unavailable
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
