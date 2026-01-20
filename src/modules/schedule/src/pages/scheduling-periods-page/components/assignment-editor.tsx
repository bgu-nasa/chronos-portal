/**
 * Assignment Editor Modal Component
 * Handles both create and edit modes for assignments
 */

import { useEffect, useState } from "react";
import { Modal, TextInput, Button, Group, Text, Stack } from "@mantine/core";
import { useAssignmentEditorStore } from "@/modules/schedule/src/stores/assignment-editor.store";
import {
    useCreateAssignment,
    useUpdateAssignment,
} from "@/modules/schedule/src/hooks/use-assignments";

export function AssignmentEditor() {
    const { isOpen, mode, assignment, slotId, close } = useAssignmentEditorStore();
    const { createAssignment, isLoading: isCreating, error: createError, clearError: clearCreateError } = useCreateAssignment();
    const { updateAssignment, isLoading: isUpdating, error: updateError, clearError: clearUpdateError } = useUpdateAssignment();

    const [resourceId, setResourceId] = useState("");
    const [activityId, setActivityId] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when modal opens/closes or assignment changes
    useEffect(() => {
        if (isOpen) {
            clearCreateError();
            clearUpdateError();
            setErrors({});

            if (mode === "edit" && assignment) {
                setResourceId(assignment.resourceId);
                setActivityId(assignment.activityId);
            } else {
                setResourceId("");
                setActivityId("");
            }
        }
    }, [isOpen, mode, assignment]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!resourceId.trim()) {
            newErrors.resourceId = "Resource ID is required";
        }
        if (!activityId.trim()) {
            newErrors.activityId = "Activity ID is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        let success = false;

        if (mode === "create" && slotId) {
            const result = await createAssignment({
                slotId,
                resourceId: resourceId.trim(),
                activityId: activityId.trim(),
            });
            success = result !== null;
        } else if (mode === "edit" && assignment) {
            success = await updateAssignment(assignment.id, {
                resourceId: resourceId.trim(),
                activityId: activityId.trim(),
            });
        }

        if (success) {
            handleClose();
        }
    };

    const handleClose = () => {
        close();
        setResourceId("");
        setActivityId("");
        setErrors({});
        clearCreateError();
        clearUpdateError();
    };

    const isLoading = isCreating || isUpdating;
    const apiError = createError || updateError;
    const title = mode === "create" ? "Add Assignment" : "Edit Assignment";
    const submitButtonLabel = mode === "create" ? "Create" : "Save";

    return (
        <Modal opened={isOpen} onClose={handleClose} title={title} centered size="md">
            <form onSubmit={handleSubmit}>
                <Stack gap="md">
                    <TextInput
                        label="Resource ID"
                        placeholder="Enter resource ID"
                        value={resourceId}
                        onChange={(e) => {
                            setResourceId(e.currentTarget.value);
                            setErrors((prev) => {
                                const { resourceId: _, ...rest } = prev;
                                return rest;
                            });
                        }}
                        error={errors.resourceId}
                        required
                        disabled={isLoading}
                        data-autofocus
                    />

                    <TextInput
                        label="Activity ID"
                        placeholder="Enter activity ID"
                        value={activityId}
                        onChange={(e) => {
                            setActivityId(e.currentTarget.value);
                            setErrors((prev) => {
                                const { activityId: _, ...rest } = prev;
                                return rest;
                            });
                        }}
                        error={errors.activityId}
                        required
                        disabled={isLoading}
                    />

                    {apiError && (
                        <Text size="sm" c="var(--mantine-color-error)">
                            {apiError}
                        </Text>
                    )}

                    <Group justify="flex-end" mt="md">
                        <Button
                            variant="subtle"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" loading={isLoading}>
                            {submitButtonLabel}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
