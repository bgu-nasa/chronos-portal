/**
 * Assignment Editor Modal Component
 * Handles both create and edit modes for assignments
 */

import { useEffect, useState, useMemo } from "react";
import { Modal, Select, TextInput, Button, Group, Text, Stack } from "@mantine/core";
import { useAssignmentEditorStore } from "@/modules/schedule/src/stores/assignment-editor.store";
import {
    useCreateAssignment,
    useUpdateAssignment,
} from "@/modules/schedule/src/hooks/use-assignments";
import { useResources } from "@/modules/schedule/src/hooks/use-resources";

export function AssignmentEditor() {
    const { isOpen, mode, assignment, slotId, close } = useAssignmentEditorStore();
    const { createAssignment, isLoading: isCreating, error: createError, clearError: clearCreateError } = useCreateAssignment();
    const { updateAssignment, isLoading: isUpdating, error: updateError, clearError: clearUpdateError } = useUpdateAssignment();
    const { resources, isLoading: isLoadingResources } = useResources();

    const [resourceId, setResourceId] = useState<string | null>(null);
    const [activityId, setActivityId] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Transform resources to Select options - show Location / Identifier, value is ID
    const resourceOptions = useMemo(() => {
        return resources.map((resource) => ({
            value: resource.id,
            label: `${resource.location} / ${resource.identifier}`,
        }));
    }, [resources]);

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
                setResourceId(null);
                setActivityId("");
            }
        }
    }, [isOpen, mode, assignment]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!resourceId) {
            newErrors.resourceId = "Resource is required";
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

        if (mode === "create" && slotId && resourceId) {
            const result = await createAssignment({
                slotId,
                resourceId,
                activityId: activityId.trim(),
            });
            success = result !== null;
        } else if (mode === "edit" && assignment && resourceId) {
            success = await updateAssignment(assignment.id, {
                resourceId,
                activityId: activityId.trim(),
            });
        }

        if (success) {
            handleClose();
        }
    };

    const handleClose = () => {
        close();
        setResourceId(null);
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
                    <Select
                        label="Resource (Location)"
                        placeholder={
                            isLoadingResources
                                ? "Loading resources..."
                                : resourceOptions.length === 0
                                    ? "There are no resources yet"
                                    : "Select a resource"
                        }
                        data={resourceOptions}
                        value={resourceId}
                        onChange={(value) => {
                            setResourceId(value);
                            setErrors((prev) => {
                                const { resourceId: _, ...rest } = prev;
                                return rest;
                            });
                        }}
                        error={errors.resourceId}
                        required
                        disabled={isLoading || isLoadingResources || resourceOptions.length === 0}
                        searchable
                        clearable
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
