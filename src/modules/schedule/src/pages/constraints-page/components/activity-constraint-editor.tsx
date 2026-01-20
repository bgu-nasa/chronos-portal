import { useEffect } from "react";
import { Modal, TextInput, Button, Group, Select, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";

import { useActivities, useSubjects } from "@/modules/resources/src/hooks";

import resources from "../constraints-page.resources.json";

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
            activityId: (value: string) => (value ? null : resources.validationMessages.activityRequired),
            key: (value: string) => (value ? null : resources.validationMessages.keyRequired),
            value: (value: string) => (value ? null : resources.validationMessages.valueRequired),
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
            title={initialData ? resources.modalTitles.editActivityConstraint : resources.modalTitles.createActivityConstraint}
            size={resources.modalSize}
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Select
                    label={resources.labels.activity}
                    placeholder={resources.placeholders.selectActivity}
                    data={activityOptions}
                    searchable
                    required
                    mb="md"
                    {...form.getInputProps("activityId")}
                />

                <TextInput
                    label={resources.labels.key}
                    placeholder={resources.placeholders.keyExamples.activity}
                    required
                    mb="md"
                    {...form.getInputProps("key")}
                />

                <Textarea
                    label={resources.labels.value}
                    placeholder={resources.placeholders.valueExamples.activity}
                    required
                    mb="md"
                    minRows={resources.other.textareaMinRows}
                    {...form.getInputProps("value")}
                />

                <Group justify="flex-end" mt="xl">
                    <Button variant="subtle" onClick={onClose} disabled={loading}>
                        {resources.cancelButton}
                    </Button>
                    <Button type="submit" loading={loading}>
                        {initialData ? resources.updateButton : resources.createButton}
                    </Button>
                </Group>
            </form>
        </Modal>
    );
}
