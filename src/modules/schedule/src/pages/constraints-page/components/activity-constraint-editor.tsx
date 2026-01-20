import { Modal, TextInput, Button, Group, Select, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useActivities } from "@/modules/resources/src/hooks";
import { useSubjects } from "@/modules/resources/src/hooks/use-subjects";

interface ActivityConstraintEditorProps {
    readonly opened: boolean;
    readonly onClose: () => void;
    readonly onSubmit: (data: {
        activityId: string;
        key: string;
        value: string;
    }) => Promise<void>;
    readonly initialData?: {
        activityId: string;
        key: string;
        value: string;
    };
    readonly loading?: boolean;
}

export function ActivityConstraintEditor({
    opened,
    onClose,
    onSubmit,
    initialData,
    loading = false,
}: ActivityConstraintEditorProps) {
    const { activities, fetchActivities } = useActivities();
    const { subjects, fetchSubjects } = useSubjects();

    const form = useForm({
        initialValues: {
            activityId: initialData?.activityId || "",
            key: initialData?.key || "",
            value: initialData?.value || "",
        },
        validate: {
            activityId: (value: string) => (value ? null : "Activity is required"),
            key: (value: string) => (value ? null : "Key is required"),
            value: (value: string) => (value ? null : "Value is required"),
        },
    });

    useEffect(() => {
        if (opened) {
            fetchActivities();
            fetchSubjects();
            if (initialData) {
                form.setValues(initialData);
            } else {
                form.reset();
            }
        }
    }, [opened, initialData]);

    const handleSubmit = async (values: typeof form.values) => {
        await onSubmit(values);
        form.reset();
        onClose();
    };

    // Group activities by subject for better UX
    const activityOptions = activities.map((activity) => {
        const subject = subjects.find((s) => s.id === activity.subjectId);
        return {
            value: activity.id,
            label: subject
                ? `${subject.name} - ${activity.activityType}`
                : activity.activityType,
        };
    });

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={initialData ? "Edit Activity Constraint" : "Create Activity Constraint"}
            size="md"
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Select
                    label="Activity"
                    placeholder="Select activity"
                    data={activityOptions}
                    searchable
                    required
                    mb="md"
                    {...form.getInputProps("activityId")}
                />

                <TextInput
                    label="Key"
                    placeholder="e.g., required_room_type, max_students"
                    required
                    mb="md"
                    {...form.getInputProps("key")}
                />

                <Textarea
                    label="Value"
                    placeholder="e.g., lab, 30"
                    required
                    mb="md"
                    minRows={3}
                    {...form.getInputProps("value")}
                />

                <Group justify="flex-end" mt="xl">
                    <Button variant="subtle" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading}>
                        {initialData ? "Update" : "Create"}
                    </Button>
                </Group>
            </form>
        </Modal>
    );
}
