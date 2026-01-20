import { useEffect } from "react";
import { Modal, TextInput, Button, Group, Select, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";

import { useSchedulingPeriods } from "@/modules/schedule/src/hooks";

import resources from "../constraints-page.resources.json";

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
            schedulingPeriodId: (value: string) => (value ? null : resources.validationMessages.schedulingPeriodRequired),
            key: (value: string) => (value ? null : resources.validationMessages.keyRequired),
            value: (value: string) => (value ? null : resources.validationMessages.valueRequired),
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
            title={initialData ? resources.modalTitles.editOrganizationPolicy : resources.modalTitles.createOrganizationPolicy}
            size={resources.modalSize}
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Select
                    label={resources.labels.schedulingPeriod}
                    placeholder={resources.placeholders.selectSchedulingPeriod}
                    data={periodOptions}
                    searchable
                    required
                    mb="md"
                    {...form.getInputProps("schedulingPeriodId")}
                />

                <TextInput
                    label={resources.labels.key}
                    placeholder={resources.placeholders.keyExamples.organization}
                    required
                    mb="md"
                    {...form.getInputProps("key")}
                />

                <Textarea
                    label={resources.labels.value}
                    placeholder={resources.placeholders.valueExamples.organization}
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
