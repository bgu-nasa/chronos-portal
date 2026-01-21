import { Modal, Button, Group, Text, Stack, Divider, Badge } from "@mantine/core";
import { useState, useEffect } from "react";
import { resourceDataRepository } from "@/modules/schedule/src/data/resource-data-repository";
import type { ResourceResponse } from "@/modules/schedule/src/data/resource.types";

interface EventBlock {
    weekday?: string;
    startTime: string;
    endTime: string;
    activityId?: string;
    activityType?: string;
    subjectName?: string;
    assignmentId?: string;
    slotId?: string;
    resourceId?: string;
}

interface EventDetailsModalProps {
    readonly opened: boolean;
    readonly onClose: () => void;
    readonly eventBlock: EventBlock | null;
}

export function EventDetailsModal({
    opened,
    onClose,
    eventBlock,
}: EventDetailsModalProps) {
    const [resource, setResource] = useState<ResourceResponse | null>(null);
    const [loadingResource, setLoadingResource] = useState(false);

    useEffect(() => {
        if (opened && eventBlock?.resourceId) {
            setLoadingResource(true);
            resourceDataRepository
                .getResource(eventBlock.resourceId)
                .then((res) => {
                    setResource(res);
                })
                .catch((error) => {
                    $app.logger.error("[EventDetailsModal] Error fetching resource:", error);
                })
                .finally(() => {
                    setLoadingResource(false);
                });
        } else {
            setResource(null);
        }
    }, [opened, eventBlock?.resourceId]);

    if (!eventBlock) {
        return null;
    }

    const weekdayName = eventBlock.weekday || "Unknown Day";
    const timeRange = `${eventBlock.startTime} - ${eventBlock.endTime}`;

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Event Details"
            size="md"
        >
            <Stack gap="md">
                <div>
                    <Text size="sm" c="dimmed" mb={4}>
                        Subject
                    </Text>
                    <Text fw={600} size="lg">
                        {eventBlock.subjectName || "Unknown Subject"}
                    </Text>
                </div>

                <Divider />

                <div>
                    <Text size="sm" c="dimmed" mb={4}>
                        Activity Type
                    </Text>
                    <Badge size="lg" variant="light" color="blue">
                        {eventBlock.activityType || "Unknown"}
                    </Badge>
                </div>

                <Divider />

                <div>
                    <Text size="sm" c="dimmed" mb={4}>
                        Schedule
                    </Text>
                    <Text fw={500}>
                        {weekdayName}
                    </Text>
                    <Text>
                        {timeRange}
                    </Text>
                </div>

                {resource && (
                    <>
                        <Divider />
                        <div>
                            <Text size="sm" c="dimmed" mb={4}>
                                Resource
                            </Text>
                            <Text fw={500}>
                                {resource.identifier || resource.id}
                            </Text>
                            {resource.location && (
                                <Text size="sm" c="dimmed">
                                    Location: {resource.location}
                                </Text>
                            )}
                            {resource.capacity && (
                                <Text size="sm" c="dimmed">
                                    Capacity: {resource.capacity}
                                </Text>
                            )}
                        </div>
                    </>
                )}

                {loadingResource && (
                    <Text size="sm" c="dimmed" style={{ fontStyle: "italic" }}>
                        Loading resource details...
                    </Text>
                )}

                <Group justify="flex-end" mt="xl">
                    <Button onClick={onClose}>
                        Close
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
