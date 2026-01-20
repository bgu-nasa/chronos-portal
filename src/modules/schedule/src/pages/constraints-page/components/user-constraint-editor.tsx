import { useEffect } from "react";
import { Modal, TextInput, Button, Group, Select, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useUsers } from "@/modules/auth/src/hooks";
import { useSchedulingPeriods } from "@/modules/schedule/src/hooks";

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
            userId: (value: string) => (value ? null : "User is required"),
            schedulingPeriodId: (value: string) => (value ? null : "Scheduling period is required"),
            key: (value: string) => (value ? null : "Key is required"),
            value: (value: string) => (value ? null : "Value is required"),
        },
    });

    useEffect(() => {
        console.log("[UserConstraintEditor] Mounted");
        return () => console.log("[UserConstraintEditor] Unmounted");
    }, []);

    useEffect(() => {
        if (opened) {
            console.log("[UserConstraintEditor] Modal opened, triggering enrichment fetches");
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

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={initialData 
                ? `Edit User ${isPreference ? 'Preference' : 'Constraint'}` 
                : `Create User ${isPreference ? 'Preference' : 'Constraint'}`}
            size="md"
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                {isAdmin ? (
                    <Select
                        label="User"
                        placeholder="Select user"
                        data={userOptions}
                        searchable
                        required
                        mb="md"
                        {...form.getInputProps("userId")}
                    />
                ) : (
                    <TextInput
                        label="User"
                        value={
                            users.some((u) => u.id === currentUserId)
                                ? `${users.find((u) => u.id === currentUserId)?.firstName} ${users.find((u) => u.id === currentUserId)?.lastName}`
                                : "Current User"
                        }
                        disabled
                        mb="md"
                    />
                )}

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
                    placeholder="e.g., preferred_time, max_hours_per_day"
                    required
                    mb="md"
                    {...form.getInputProps("key")}
                />

                <Textarea
                    label="Value"
                    placeholder="e.g., 09:00-12:00, 8"
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
