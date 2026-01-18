import { useEffect, useState } from "react";
import { Modal, Select, JsonInput, TextInput, Button, Group, Stack } from "@mantine/core";
import { useConstraintEditorStore } from "@/modules/schedule/src/stores/constraint-editor.store";
import {
    useActivityConstraints,
    useUserConstraints,
    useUserPreferences,
    useOrganizationPolicies
} from "@/modules/schedule/src/hooks/use-constraints";
import { useActivities } from "@/modules/resources/src/hooks/use-activities";
import { useSubjects } from "@/modules/resources/src/hooks/use-subjects";
import { useUsers } from "@/modules/auth/src/hooks/use-users";
import { useSchedulingPeriods } from "@/modules/schedule/src/hooks/use-scheduling-periods";

const COMMON_KEYS = [
    { label: "Preferred Weekdays", value: "preferred_weekdays" },
    { label: "Time Range", value: "time_range" },
    { label: "Required Capacity", value: "required_capacity" },
    { label: "Location Preference", value: "location_preference" },
    { label: "Compatible Resource Types", value: "compatible_resource_types" },
];

export function ConstraintEditor() {
    const { isOpen, mode, type, constraint, close } = useConstraintEditorStore();

    const { fetchActivityConstraints, createActivityConstraint, updateActivityConstraint } = useActivityConstraints();
    const { fetchUserConstraints, createUserConstraint, updateUserConstraint } = useUserConstraints();
    const { fetchUserPreferences, createUserPreference, updateUserPreference } = useUserPreferences();
    const { fetchOrganizationPolicies, createOrganizationPolicy, updateOrganizationPolicy } = useOrganizationPolicies();

    const { activities, fetchActivities } = useActivities();
    const { subjects, fetchSubjects } = useSubjects();
    const { users, fetchUsers } = useUsers();
    const { schedulingPeriods, fetchSchedulingPeriods } = useSchedulingPeriods();

    const [key, setKey] = useState<string | null>("");
    const [customKey, setCustomKey] = useState("");
    const [value, setValue] = useState("");
    const [activityId, setActivityId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [schedulingPeriodId, setSchedulingPeriodId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchActivities();
            fetchSubjects();
            fetchUsers();
            fetchSchedulingPeriods();

            if (mode === "edit" && constraint) {
                const c = constraint as any;
                const isCommon = COMMON_KEYS.some(k => k.value === c.key);
                if (isCommon) {
                    setKey(c.key);
                    setCustomKey("");
                } else {
                    setKey("custom");
                    setCustomKey(c.key);
                }
                setValue(c.value);
                setActivityId(c.activityId || null);
                setUserId(c.userId || null);
                setSchedulingPeriodId(c.schedulingPeriodId || null);
            } else {
                setKey("");
                setCustomKey("");
                setValue("");
                setActivityId(null);
                setUserId(null);
                setSchedulingPeriodId(null);
            }
        }
    }, [isOpen, mode, constraint]);

    const handleActivitySubmit = async (finalKey: string) => {
        if (mode === "edit" && !constraint) return false;
        const success = mode === "create"
            ? await createActivityConstraint({ activityId: activityId!, key: finalKey, value })
            : await updateActivityConstraint(constraint!.id, { key: finalKey, value });
        if (success) await fetchActivityConstraints();
        return success;
    };

    const handleUserSubmit = async (finalKey: string) => {
        if (mode === "edit" && !constraint) return false;
        const success = mode === "create"
            ? await createUserConstraint({ userId: userId!, schedulingPeriodId: schedulingPeriodId!, key: finalKey, value })
            : await updateUserConstraint(constraint!.id, { key: finalKey, value });
        if (success) await fetchUserConstraints();
        return success;
    };

    const handlePreferenceSubmit = async (finalKey: string) => {
        if (mode === "edit" && !constraint) return false;
        const success = mode === "create"
            ? await createUserPreference({ userId: userId!, schedulingPeriodId: schedulingPeriodId!, key: finalKey, value })
            : await updateUserPreference(userId!, schedulingPeriodId!, finalKey, { value });
        if (success) await fetchUserPreferences();
        return success;
    };

    const handlePolicySubmit = async (finalKey: string) => {
        if (mode === "edit" && !constraint) return false;
        const success = mode === "create"
            ? await createOrganizationPolicy({ schedulingPeriodId: schedulingPeriodId!, key: finalKey, value })
            : await updateOrganizationPolicy(constraint!.id, { key: finalKey, value });
        if (success) await fetchOrganizationPolicies();
        return success;
    };

    const handleSubmit = async () => {
        const finalKey = key === "custom" ? customKey : key;
        if (!finalKey) return;

        setIsLoading(true);
        try {
            let success = false;
            if (type === "activity") success = await handleActivitySubmit(finalKey);
            else if (type === "user") success = await handleUserSubmit(finalKey);
            else if (type === "preference") success = await handlePreferenceSubmit(finalKey);
            else if (type === "policy") success = await handlePolicySubmit(finalKey);

            if (success) close();
        } finally {
            setIsLoading(false);
        }
    };

    const getConstraintLabel = () => {
        if (type === "policy") return "Organization Policy";
        if (type === "preference") return "User Preference";
        return `${type.charAt(0).toUpperCase() + type.slice(1)} Constraint`;
    };

    const modalTitle = `${mode === "create" ? "Add" : "Edit"} ${getConstraintLabel()}`;

    return (
        <Modal opened={isOpen} onClose={close} title={modalTitle} centered>
            <Stack>
                {mode === "create" && type === "activity" && (
                    <Select
                        label="Activity"
                        data={activities.map(a => {
                            const subject = subjects.find(s => s.id === a.subjectId);
                            const label = subject
                                ? `${subject.name} - ${a.activityType}`
                                : `${a.activityType} (${a.id.slice(0, 8)})`;
                            return { value: a.id, label };
                        })}
                        value={activityId}
                        onChange={setActivityId}
                        required
                        searchable
                    />
                )}

                {mode === "create" && (type === "user" || type === "preference") && (
                    <Select
                        label="User"
                        data={users.map(u => ({ value: u.id, label: `${u.firstName} ${u.lastName}` }))}
                        value={userId}
                        onChange={setUserId}
                        required
                        searchable
                    />
                )}

                {mode === "create" && (type === "user" || type === "preference" || type === "policy") && (
                    <Select
                        label="Scheduling Period"
                        data={schedulingPeriods.map(p => ({ value: p.id, label: p.name }))}
                        value={schedulingPeriodId}
                        onChange={setSchedulingPeriodId}
                        required
                        searchable
                    />
                )}

                <Select
                    label="Constraint Key"
                    data={[...COMMON_KEYS, { label: "Custom...", value: "custom" }]}
                    value={key}
                    onChange={setKey}
                    required
                />

                {key === "custom" && (
                    <TextInput
                        label="Custom Key"
                        placeholder="Enter key name"
                        value={customKey}
                        onChange={(e) => setCustomKey(e.currentTarget.value)}
                        required
                    />
                )}

                <JsonInput
                    label="Value"
                    placeholder='{"start": "08:00", "end": "17:00"} or "Monday,Wednesday"'
                    formatOnBlur
                    autosize
                    minRows={4}
                    value={value}
                    onChange={setValue}
                    required
                />

                <Group justify="flex-end" mt="md">
                    <Button variant="subtle" onClick={close}>Cancel</Button>
                    <Button onClick={handleSubmit} loading={isLoading} disabled={!key || (key === "custom" && !customKey) || !value || (mode === "create" && type === "activity" && !activityId) || (mode === "create" && (type === "user" || type === "preference") && !userId) || (mode === "create" && (type === "user" || type === "preference" || type === "policy") && !schedulingPeriodId)}>
                        Save
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
