import { Modal, TextInput, Button, Stack, NumberInput } from "@mantine/core";
import { useState } from "react";
import { $app } from "@/infra/service";

interface ActivityCreatorProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: {
        activityType: string;
        assignedUserId: string;
        expectedStudents: number | null;
    }) => Promise<void>;
    loading?: boolean;
}

export function ActivityCreator({
    opened,
    onClose,
    onSubmit,
    loading = false,
}: ActivityCreatorProps) {
    const [activityType, setActivityType] = useState("");
    const [assignedUserId, setAssignedUserId] = useState("");
    const [expectedStudents, setExpectedStudents] = useState<number | null>(null);

    const handleSubmit = async () => {
        $app.logger.info("[ActivityCreator] handleSubmit called", {
            activityType,
            assignedUserId,
            expectedStudents,
        });

        if (!activityType.trim()) {
            $app.logger.warn("[ActivityCreator] Validation failed - empty activity type");
            return;
        }

        $app.logger.info("[ActivityCreator] Calling onSubmit...");
        await onSubmit({
            activityType,
            assignedUserId: assignedUserId.trim() || "00000000-0000-0000-0000-000000000000",
            expectedStudents,
        });

        $app.logger.info("[ActivityCreator] onSubmit completed, resetting form");
        setActivityType("");
        setAssignedUserId("");
        setExpectedStudents(null);
    };

    const handleClose = () => {
        setActivityType("");
        setAssignedUserId("");
        setExpectedStudents(null);
        onClose();
    };

    return (
        <Modal opened={opened} onClose={handleClose} title="Create Group" centered>
            <Stack>
                <TextInput
                    label="Activity Type"
                    placeholder="e.g. Lecture, Practice, Lab"
                    value={activityType}
                    onChange={(e) => setActivityType(e.currentTarget.value)}
                    required
                />
                <TextInput
                    label="Assigned User ID"
                    placeholder="User GUID (optional)"
                    value={assignedUserId}
                    onChange={(e) => setAssignedUserId(e.currentTarget.value)}
                />
                <NumberInput
                    label="Expected Students"
                    placeholder="Number of students"
                    value={expectedStudents ?? undefined}
                    onChange={(value) => setExpectedStudents(value === "" ? null : Number(value))}
                    min={0}
                />
                <Button
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={!activityType.trim()}
                    fullWidth
                >
                    Create Group
                </Button>
            </Stack>
        </Modal>
    );
}
