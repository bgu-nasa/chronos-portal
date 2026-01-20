import { useEffect, useMemo, useState } from "react";
import {
    Modal, Button, Group,
    Select, MultiSelect, NumberInput
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { useActivities, useSubjects } from "@/modules/resources/src/hooks";

import resources from "../constraints-page.resources.json";
import { parseRequiredCapacity, parseCommaSeparated } from "../utils/constraint-value-parser";
import { serializeRequiredCapacity, serializeCommaSeparated } from "../utils/constraint-value-serializer";
import type { RequiredCapacityFormData } from "../utils/constraint-value-parser";

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

    const constraintTypeOptions = useMemo(() => {
        return resources.constraintTypeOptions.activityConstraints.map(opt => ({
            value: opt.value,
            label: opt.label
        }));
    }, []);

    // Form state for required_capacity: min and max numbers
    const [capacityData, setCapacityData] = useState<RequiredCapacityFormData>({});

    // Form state for location_preference and compatible_resource_types: array of strings
    const [locationValues, setLocationValues] = useState<string[]>([]);
    const [resourceTypeValues, setResourceTypeValues] = useState<string[]>([]);

    const form = useForm({
        initialValues: {
            activityId: initialData?.activityId || "",
            key: initialData?.key || "",
        },
        validate: {
            activityId: (value: string) => (value ? null : resources.validationMessages.activityRequired),
            key: (value: string) => (value ? null : resources.validationMessages.keyRequired),
        },
    });

    useEffect(() => {
        if (opened) {
            fetchActivities();
            fetchSubjects();
            if (initialData) {
                form.setValues({
                    activityId: initialData.activityId,
                    key: initialData.key,
                });

                // Parse the value based on constraint type
                if (initialData.key === "required_capacity") {
                    const parsed = parseRequiredCapacity(initialData.value);
                    setCapacityData(parsed);
                } else if (initialData.key === "location_preference") {
                    const parsed = parseCommaSeparated(initialData.value);
                    setLocationValues(parsed);
                } else if (initialData.key === "compatible_resource_types") {
                    const parsed = parseCommaSeparated(initialData.value);
                    setResourceTypeValues(parsed);
                }
            } else {
                form.reset();
                setCapacityData({});
                setLocationValues([]);
                setResourceTypeValues([]);
            }
        }
    }, [opened, initialData]);

    const handleKeyChange = (value: string | null) => {
        form.setFieldValue("key", value || "");
        // Clear form data when key changes (only when creating new, not editing)
        if (!initialData && value) {
            setCapacityData({});
            setLocationValues([]);
            setResourceTypeValues([]);
        }
    };

    // Validation for form submission
    const validateForm = (): string | null => {
        if (form.values.key === "required_capacity") {
            if (capacityData.min === undefined && capacityData.max === undefined) {
                return resources.validationMessages.minOrMaxRequired;
            }
            if (capacityData.min !== undefined && capacityData.max !== undefined && capacityData.min > capacityData.max) {
                return resources.validationMessages.minGreaterThanMax;
            }
        } else if (form.values.key === "location_preference") {
            if (locationValues.length === 0) {
                return resources.validationMessages.atLeastOneLocation;
            }
        } else if (form.values.key === "compatible_resource_types") {
            if (resourceTypeValues.length === 0) {
                return resources.validationMessages.atLeastOneResourceType;
            }
        }
        return null;
    };

    const handleSubmit = async (values: typeof form.values) => {
        // Validate before submitting
        const validationError = validateForm();
        if (validationError) {
            form.setFieldError("value", validationError);
            return;
        }

        // Serialize form data based on constraint type
        let serializedValue = "";

        if (values.key === "required_capacity") {
            serializedValue = serializeRequiredCapacity(capacityData);
        } else if (values.key === "location_preference") {
            serializedValue = serializeCommaSeparated(locationValues);
        } else if (values.key === "compatible_resource_types") {
            serializedValue = serializeCommaSeparated(resourceTypeValues);
        }

        await onSubmit({
            ...values,
            value: serializedValue,
        });
        form.reset();
        setCapacityData({});
        setLocationValues([]);
        setResourceTypeValues([]);
        onClose();
    };

    // Handle form submission with validation
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            form.setFieldError("value", validationError);
        } else {
            form.onSubmit(handleSubmit)(e);
        }
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
            <form onSubmit={handleFormSubmit}>
                <Select
                    label={resources.labels.activity}
                    placeholder={resources.placeholders.selectActivity}
                    data={activityOptions}
                    searchable
                    required
                    mb="md"
                    {...form.getInputProps("activityId")}
                />

                <Select
                    label={resources.labels.key}
                    placeholder="Select constraint type"
                    data={constraintTypeOptions}
                    required
                    mb="md"
                    value={form.values.key}
                    onChange={handleKeyChange}
                    error={form.errors.key}
                />

                {form.values.key === "required_capacity" && (
                    <Group grow mb="md">
                        <NumberInput
                            label={resources.labels.minCapacity}
                            placeholder={resources.placeholders.enterMinCapacity}
                            value={capacityData.min}
                            onChange={(value) => setCapacityData({ ...capacityData, min: typeof value === "number" ? value : undefined })}
                            min={0}
                            allowDecimal={false}
                        />
                        <NumberInput
                            label={resources.labels.maxCapacity}
                            placeholder={resources.placeholders.enterMaxCapacity}
                            value={capacityData.max}
                            onChange={(value) => setCapacityData({ ...capacityData, max: typeof value === "number" ? value : undefined })}
                            min={0}
                            allowDecimal={false}
                        />
                    </Group>
                )}

                {form.values.key === "location_preference" && (
                    <MultiSelect
                        label={resources.labels.locations}
                        placeholder={resources.placeholders.enterLocations}
                        value={locationValues}
                        onChange={setLocationValues}
                        data={locationValues.map(v => ({ value: v, label: v }))}
                        searchable
                        required
                        mb="md"
                    />
                )}

                {form.values.key === "compatible_resource_types" && (
                    <MultiSelect
                        label={resources.labels.resourceTypes}
                        placeholder={resources.placeholders.enterResourceTypes}
                        value={resourceTypeValues}
                        onChange={setResourceTypeValues}
                        data={resourceTypeValues.map(v => ({ value: v, label: v }))}
                        searchable
                        required
                        mb="md"
                    />
                )}

                <Group justify="flex-end" mt="xl">
                    <Button variant="subtle" onClick={onClose} disabled={loading}>
                        {resources.cancelButton}
                    </Button>
                    <Button
                        type="submit"
                        loading={loading}
                    >
                        {initialData ? resources.updateButton : resources.createButton}
                    </Button>
                </Group>
            </form>
        </Modal>
    );
}
