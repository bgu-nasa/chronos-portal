/**
 * Scheduling Period Editor Modal Component
 * Handles both create and edit modes for scheduling periods
 */

import { useEffect, useState, useMemo } from "react";
import { Modal, TextInput, Button, Group, Text, Stack } from "@mantine/core";
import { Calendar } from "primereact/calendar";
import { useSchedulingPeriodEditorStore } from "@/modules/schedule/src/stores/scheduling-period-editor.store";
import {
    useCreateSchedulingPeriod,
    useUpdateSchedulingPeriod,
} from "@/modules/schedule/src/hooks/use-scheduling-periods";
import resources from "@/modules/schedule/src/pages/scheduling-periods-page/scheduling-periods-page.resources.json";
import styles from "@/modules/schedule/src/pages/scheduling-periods-page/components/scheduling-period-editor.module.css";

export function SchedulingPeriodEditor() {
    const { isOpen, mode, schedulingPeriod, close } = useSchedulingPeriodEditorStore();
    const { createSchedulingPeriod, isLoading: isCreating } = useCreateSchedulingPeriod();
    const { updateSchedulingPeriod, isLoading: isUpdating } = useUpdateSchedulingPeriod();

    const [name, setName] = useState("");
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Reset form when modal opens/closes or scheduling period changes
    useEffect(() => {
        if (isOpen) {
            if (mode === "edit" && schedulingPeriod) {
                setName(schedulingPeriod.name);
                setFromDate(schedulingPeriod.fromDate ? new Date(schedulingPeriod.fromDate) : null);
                setToDate(schedulingPeriod.toDate ? new Date(schedulingPeriod.toDate) : null);
            } else {
                setName("");
                setFromDate(null);
                setToDate(null);
            }
            setError(null);
        }
    }, [isOpen, mode, schedulingPeriod]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        if (name.trim().length === 0) {
            setError(resources.editorNameRequired);
            return;
        }

        if (!fromDate) {
            setError(resources.editorFromDateRequired);
            return;
        }

        if (!toDate) {
            setError(resources.editorToDateRequired);
            return;
        }

        setError(null);
        let success = false;

        const request = {
            name: name.trim(),
            fromDate: fromDate.toISOString(),
            toDate: toDate.toISOString(),
        };

        if (mode === "create") {
            const result = await createSchedulingPeriod(request);
            success = result !== null;
        } else if (mode === "edit" && schedulingPeriod) {
            success = await updateSchedulingPeriod(schedulingPeriod.id, request);
        }

        if (success) {
            handleClose();
        }
    };

    const handleClose = () => {
        close();
        setName("");
        setFromDate(null);
        setToDate(null);
        setError(null);
    };

    const isLoading = isCreating || isUpdating;
    const title =
        mode === "create"
            ? resources.editorCreateTitle
            : resources.editorEditTitle;
    const submitButtonLabel =
        mode === "create"
            ? resources.editorCreateButton
            : resources.editorSaveButton;

    // Date constraints: can't select dates before today
    const today = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now;
    }, []);

    // The minimum date for "To Date" is either today or the selected "From Date", whichever is later
    const minToDate = useMemo(() => {
        if (!fromDate) return today;
        return fromDate > today ? fromDate : today;
    }, [fromDate, today]);

    // Handle From Date change - clear To Date if it's now invalid
    const handleFromDateChange = (value: Date | null) => {
        setFromDate(value);

        // If the new from date is after the current to date, clear to date
        if (value && toDate && value > toDate) {
            setToDate(null);
        }
    };

    return (
        <Modal opened={isOpen} onClose={handleClose} title={title} centered size="md">
            <form onSubmit={handleSubmit}>
                <TextInput
                    label={resources.editorNameLabel}
                    placeholder={resources.editorNamePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                    error={error && error === resources.editorNameRequired ? error : null}
                    required
                    disabled={isLoading}
                    data-autofocus
                    mb="md"
                />

                <Stack gap="xs" mb="md">
                    <Text size="sm" fw={500}>
                        {resources.editorFromDateLabel} <span style={{ color: "var(--mantine-color-red-6)" }}>*</span>
                    </Text>
                    <Calendar
                        value={fromDate}
                        onChange={(e) => handleFromDateChange(e.value as Date | null)}
                        minDate={today}
                        dateFormat="M dd, yy"
                        placeholder={resources.editorFromDatePlaceholder}
                        showIcon
                        disabled={isLoading}
                        className={styles.calendarInput}
                        panelClassName={styles.calendarPanel}
                    />
                    {error && error === resources.editorFromDateRequired && (
                        <Text size="xs" c="red">{error}</Text>
                    )}
                </Stack>

                <Stack gap="xs" mb="md">
                    <Text size="sm" fw={500}>
                        {resources.editorToDateLabel} <span style={{ color: "var(--mantine-color-red-6)" }}>*</span>
                    </Text>
                    <Calendar
                        value={toDate}
                        onChange={(e) => setToDate(e.value as Date | null)}
                        minDate={minToDate}
                        dateFormat="M dd, yy"
                        placeholder={resources.editorToDatePlaceholder}
                        showIcon
                        disabled={isLoading}
                        className={styles.calendarInput}
                        panelClassName={styles.calendarPanel}
                    />
                    {error && error === resources.editorToDateRequired && (
                        <Text size="xs" c="red">{error}</Text>
                    )}
                </Stack>

                <Group justify="flex-end" mt="md">
                    <Button
                        variant="subtle"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        {resources.editorCancelButton}
                    </Button>
                    <Button type="submit" loading={isLoading}>
                        {submitButtonLabel}
                    </Button>
                </Group>
            </form>
        </Modal>
    );
}
