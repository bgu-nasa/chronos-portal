import { useEffect } from "react";
import { Modal, TextInput, Button, Group, Select, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSchedulingPeriods } from "@/modules/schedule/src/hooks";

interface OrganizationPolicyEditorProps {
    readonly opened: boolean;
    readonly onClose: () => void;
    readonly onSubmit: (data: {
        schedulingPeriodId: string;
        key: string;
        value: string;
    }) => Promise<void>;
    readonly initialData?: {
        schedulingPeriodId: string;
        key: string;
        value: string;
    };
    readonly loading?: boolean;
}

export function OrganizationPolicyEditor({
    opened,
    onClose,
    onSubmit,
    initialData,
    loading = false,
}: OrganizationPolicyEditorProps) {
    const { schedulingPeriods, fetchSchedulingPeriods } = useSchedulingPeriods();

    const form = useForm({
        initialValues: {
            schedulingPeriodId: initialData?.schedulingPeriodId || "",
            key: initialData?.key || "",
            value: initialData?.value || "",
        },
        validate: {
            schedulingPeriodId: (value: string) => (value ? null : "Scheduling period is required"),
            key: (value: string) => (value ? null : "Key is required"),
            value: (value: string) => (value ? null : "Value is required"),
        },
    });

    useEffect(() => {
        if (opened) {
            fetchSchedulingPeriods();
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

    const periodOptions = schedulingPeriods.map((period) => ({
        value: period.id,
        label: period.name,
    }));

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={initialData ? "Edit Organization Policy" : "Create Organization Policy"}
            size="md"
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Select
                    label="Scheduling Period"
                    placeholder="Select scheduling period"
                    data={periodOptions}
                    searchable
                    required
                    mb="md"
                    {...form.getInputProps("schedulingPeriodId")}
                />

                <TextInput
                    label="Key"
                    placeholder="e.g., max_daily_hours, min_break_time"
                    required
                    mb="md"
                    {...form.getInputProps("key")}
                />

                <Textarea
                    label="Value"
                    placeholder="e.g., 8, 30"
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
