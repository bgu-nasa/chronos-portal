import { Modal, TextInput, Button, Stack, NumberInput } from "@mantine/core";
import { useState, useEffect } from "react";

interface GroupEditorProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: {
        activityType: string;
        assignedUserId: string;
        expectedStudents: number | null;
    }) => Promise<void>;
    loading?: boolean;
    initialData?: {
        activityType: string;
        assignedUserId: string;
        expectedStudents: number;
    };
}

export function GroupEditor({
    opened,
    onClose,
    onSubmit,
    loading = false,
    initialData,
}: GroupEditorProps) {
    const [activityType, setActivityType] = useState("");
    const [assignedUserId, setAssignedUserId] = useState("");
    const [expectedStudents, setExpectedStudents] = useState<number | null>(null);

    useEffect(() => {
        if (initialData) {
            setActivityType(initialData.activityType);
            setAssignedUserId(initialData.assignedUserId);
            setExpectedStudents(initialData.expectedStudents);
        }
    }, [initialData]);

    const handleSubmit = async () => {
        console.log("🟠 [GroupEditor] handleSubmit called", {
            activityType,
            assignedUserId,
            expectedStudents,
        });

        if (!activityType.trim()) {
            console.warn("🟠 [GroupEditor] Validation failed - empty activity type");
            return;
        }

        console.log("🟠 [GroupEditor] Calling onSubmit...");
        await onSubmit({
            activityType,
            assignedUserId: assignedUserId.trim() || "00000000-0000-0000-0000-000000000000",
            expectedStudents,
        });

        console.log("🟠 [GroupEditor] onSubmit completed, resetting form");
        // Reset form only after successful submission
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
        <Modal opened={opened} onClose={handleClose} title="Edit Group" centered>
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
                    Save Changes
                </Button>
            </Stack>
        </Modal>
    );
}
