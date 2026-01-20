import { useEffect } from "react";
import { Modal, TextInput, Button, Group, Select, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";

import { useUsers } from "@/modules/auth/src/hooks";
import { useSchedulingPeriods } from "@/modules/schedule/src/hooks";

import resources from "../constraints-page.resources.json";

interface UserConstraintEditorProps {
    readonly opened: boolean;
    readonly onClose: () => void;
    readonly onSubmit: (data: {
        userId: string;
        schedulingPeriodId: string;
        key: string;
        value: string;
        isPreference: boolean;
    }) => Promise<void>;
    readonly initialData?: {
        userId: string;
        schedulingPeriodId: string;
        key: string;
        value: string;
        isPreference: boolean;
    };
    readonly isAdmin: boolean;
    readonly currentUserId?: string;
    readonly loading?: boolean;
    readonly isPreference: boolean;
}

export function UserConstraintEditor({
    opened,
    onClose,
    onSubmit,
    initialData,
    isAdmin,
    currentUserId,
    loading = false,
    isPreference,
}: UserConstraintEditorProps) {
    const { users, fetchUsers } = useUsers();
    const { schedulingPeriods, fetchSchedulingPeriods } = useSchedulingPeriods();

    const form = useForm({
        initialValues: {
            userId: initialData?.userId || currentUserId || "",
            schedulingPeriodId: initialData?.schedulingPeriodId || "",
            key: initialData?.key || "",
            value: initialData?.value || "",
            isPreference: initialData?.isPreference ?? isPreference,
        },
        validate: {
            userId: (value: string) => (value ? null : resources.validationMessages.userRequired),
            schedulingPeriodId: (value: string) => (value ? null : resources.validationMessages.schedulingPeriodRequired),
            key: (value: string) => (value ? null : resources.validationMessages.keyRequired),
            value: (value: string) => (value ? null : resources.validationMessages.valueRequired),
        },
    });

    useEffect(() => {
        if (opened) {
            fetchUsers();
            fetchSchedulingPeriods();
        }
    }, [opened]);

    useEffect(() => {
        if (opened) {
            if (initialData) {
                form.setValues(initialData);
            } else {
                form.setValues({
                    userId: !isAdmin && currentUserId ? currentUserId : "",
                    schedulingPeriodId: "",
                    key: "",
                    value: "",
                    isPreference: isPreference,
                });
            }
        }
    }, [opened, initialData, isAdmin, currentUserId, isPreference]);

    const handleSubmit = async (values: typeof form.values) => {
        await onSubmit({
            ...values,
            isPreference: initialData?.isPreference ?? isPreference,
        });
        form.reset();
        onClose();
    };

    const userOptions = users.map((user) => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName}`,
    }));

    const periodOptions = schedulingPeriods.map((period) => ({
        value: period.id,
        label: period.name,
    }));

    let modalTitle: string;
    if (initialData) {
        modalTitle = isPreference
            ? resources.modalTitles.editUserPreference
            : resources.modalTitles.editUserConstraint;
    } else {
        modalTitle = isPreference
            ? resources.modalTitles.createUserPreference
            : resources.modalTitles.createUserConstraint;
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={modalTitle}
            size={resources.modalSize}
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                {isAdmin ? (
                    <Select
                        label={resources.labels.user}
                        placeholder={resources.placeholders.selectUser}
                        data={userOptions}
                        searchable
                        required
                        mb="md"
                        {...form.getInputProps("userId")}
                    />
                ) : (
                    <TextInput
                        label={resources.labels.user}
                        value={
                            users.some((u) => u.id === currentUserId)
                                ? `${users.find((u) => u.id === currentUserId)?.firstName} ${users.find((u) => u.id === currentUserId)?.lastName}`
                                : resources.other.currentUser
                        }
                        disabled
                        mb="md"
                    />
                )}

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
                    placeholder={resources.placeholders.keyExamples.user}
                    required
                    mb="md"
                    {...form.getInputProps("key")}
                />

                <Textarea
                    label={resources.labels.value}
                    placeholder={resources.placeholders.valueExamples.user}
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
