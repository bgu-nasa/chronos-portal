import { useEffect, useState } from "react";
import { Modal, Select, Button, Stack, Text, Group, Chip } from "@mantine/core";
import { useSlotEditorStore } from "@/modules/schedule/src/stores/slot-editor.store";
import { useCreateSlot, useUpdateSlot } from "@/modules/schedule/src/hooks/use-slots";
import { Weekday, WeekdayFromString } from "@/modules/schedule/src/data/slot.types";
import resources from "@/modules/schedule/src/pages/slots-page/slots-page.resources.json";

interface SlotEditorProps {
    schedulingPeriodId: string;
}

// Duration options in minutes
const durationOptions = [
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" },
    { value: "150", label: "2.5 hours" },
    { value: "180", label: "3 hours" },
];

// Time options from 8:00 to 22:00
const generateTimeOptions = () => {
    const options = [];
    for (let hour = 6; hour <= 22; hour++) {
        options.push({
            value: `${hour.toString().padStart(2, "0")}:00`,
            label: `${hour.toString().padStart(2, "0")}:00`,
        });
        if (hour < 22) {
            options.push({
                value: `${hour.toString().padStart(2, "0")}:30`,
                label: `${hour.toString().padStart(2, "0")}:30`,
            });
        }
    }
    return options;
};

const timeOptions = generateTimeOptions();

// Day options for multi-select (Sunday first)
const dayOptions = [
    { value: Weekday.Sunday.toString(), label: "Sunday" },
    { value: Weekday.Monday.toString(), label: "Monday" },
    { value: Weekday.Tuesday.toString(), label: "Tuesday" },
    { value: Weekday.Wednesday.toString(), label: "Wednesday" },
    { value: Weekday.Thursday.toString(), label: "Thursday" },
    { value: Weekday.Friday.toString(), label: "Friday" },
    { value: Weekday.Saturday.toString(), label: "Saturday" },
];

export function SlotEditor({ schedulingPeriodId }: SlotEditorProps) {
    const { isOpen, mode, slot, close } = useSlotEditorStore();
    const { createSlot, error: createError, clearError: clearCreateError } = useCreateSlot();
    const { updateSlot, error: updateError, clearError: clearUpdateError } = useUpdateSlot();

    // Form state
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [startTime, setStartTime] = useState<string | null>("08:00");
    const [endTime, setEndTime] = useState<string | null>("16:00");
    const [duration, setDuration] = useState<string | null>("60");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // For edit mode - single day and times
    const [editWeekday, setEditWeekday] = useState<string | null>(null);
    const [editFromTime, setEditFromTime] = useState<string | null>(null);
    const [editToTime, setEditToTime] = useState<string | null>(null);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            clearCreateError();
            clearUpdateError();
            setErrors({});

            if (mode === "edit" && slot) {
                // Edit mode: single slot
                let weekdayValue: string;
                if (typeof slot.weekday === "string") {
                    const weekdayNum = WeekdayFromString[slot.weekday];
                    weekdayValue = weekdayNum !== undefined ? weekdayNum.toString() : "0";
                } else {
                    weekdayValue = slot.weekday.toString();
                }
                setEditWeekday(weekdayValue);
                // Extract HH:mm from time
                setEditFromTime(slot.fromTime.substring(0, 5));
                setEditToTime(slot.toTime.substring(0, 5));
            } else {
                // Create mode: bulk creation
                setSelectedDays([]);
                setStartTime("08:00");
                setEndTime("16:00");
                setDuration("60");
            }
        }
    }, [isOpen, mode, slot]);

    const validateCreate = () => {
        const newErrors: Record<string, string> = {};
        if (selectedDays.length === 0) newErrors.days = "Please select at least one day";
        if (!startTime) newErrors.startTime = "Start time is required";
        if (!endTime) newErrors.endTime = "End time is required";
        if (!duration) newErrors.duration = "Duration is required";
        if (startTime && endTime && startTime >= endTime) {
            newErrors.endTime = "End time must be after start time";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateEdit = () => {
        const newErrors: Record<string, string> = {};
        if (!editWeekday) newErrors.weekday = "Day is required";
        if (!editFromTime) newErrors.fromTime = "Start time is required";
        if (!editToTime) newErrors.toTime = "End time is required";
        if (editFromTime && editToTime && editFromTime >= editToTime) {
            newErrors.toTime = "End time must be after start time";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (mode === "create") {
                if (!validateCreate()) {
                    setIsSubmitting(false);
                    return;
                }

                // Generate slots based on time range, duration, and days
                const durationMinutes = parseInt(duration!);
                const startHour = parseInt(startTime!.split(":")[0]);
                const startMin = parseInt(startTime!.split(":")[1]);
                const endHour = parseInt(endTime!.split(":")[0]);
                const endMin = parseInt(endTime!.split(":")[1]);

                const startTotalMinutes = startHour * 60 + startMin;
                const endTotalMinutes = endHour * 60 + endMin;

                const slotsToCreate: { day: number; fromTime: string; toTime: string }[] = [];

                // Generate slot times
                let currentStart = startTotalMinutes;
                while (currentStart + durationMinutes <= endTotalMinutes) {
                    const fromHour = Math.floor(currentStart / 60);
                    const fromMin = currentStart % 60;
                    const toHour = Math.floor((currentStart + durationMinutes) / 60);
                    const toMin = (currentStart + durationMinutes) % 60;

                    const fromTimeStr = `${fromHour.toString().padStart(2, "0")}:${fromMin.toString().padStart(2, "0")}:00`;
                    const toTimeStr = `${toHour.toString().padStart(2, "0")}:${toMin.toString().padStart(2, "0")}:00`;

                    selectedDays.forEach((dayStr) => {
                        slotsToCreate.push({
                            day: parseInt(dayStr),
                            fromTime: fromTimeStr,
                            toTime: toTimeStr,
                        });
                    });

                    currentStart += durationMinutes;
                }

                // Create all slots
                for (const slotData of slotsToCreate) {
                    await createSlot({
                        schedulingPeriodId,
                        weekday: slotData.day as Weekday,
                        fromTime: slotData.fromTime,
                        toTime: slotData.toTime,
                    });
                }

                close();
            } else if (mode === "edit" && slot) {
                if (!validateEdit()) {
                    setIsSubmitting(false);
                    return;
                }

                const success = await updateSlot(slot.id, {
                    weekday: parseInt(editWeekday!) as Weekday,
                    fromTime: `${editFromTime}:00`,
                    toTime: `${editToTime}:00`,
                });

                if (success) {
                    close();
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const title = mode === "create" ? resources.editorCreateTitle : resources.editorEditTitle;
    const apiError = createError || updateError;

    return (
        <Modal opened={isOpen} onClose={close} title={title} size="md">
            <form onSubmit={handleSubmit}>
                <Stack gap="md">
                    {mode === "create" ? (
                        <>
                            <div>
                                <Text size="sm" fw={500} mb="xs">Days</Text>
                                <Chip.Group multiple value={selectedDays} onChange={setSelectedDays}>
                                    <Group gap="xs">
                                        {dayOptions.map((day) => (
                                            <Chip key={day.value} value={day.value} variant="filled">
                                                {day.label.substring(0, 3)}
                                            </Chip>
                                        ))}
                                    </Group>
                                </Chip.Group>
                                {errors.days && <Text size="xs" c="red" mt="xs">{errors.days}</Text>}
                            </div>

                            <Group grow>
                                <Select
                                    label="Start Time"
                                    placeholder="Select start time"
                                    data={timeOptions}
                                    value={startTime}
                                    onChange={setStartTime}
                                    error={errors.startTime}
                                    required
                                    searchable
                                />
                                <Select
                                    label="End Time"
                                    placeholder="Select end time"
                                    data={timeOptions}
                                    value={endTime}
                                    onChange={setEndTime}
                                    error={errors.endTime}
                                    required
                                    searchable
                                />
                            </Group>

                            <Select
                                label="Slot Duration"
                                placeholder="Select duration"
                                data={durationOptions}
                                value={duration}
                                onChange={setDuration}
                                error={errors.duration}
                                required
                            />

                            {startTime && endTime && duration && selectedDays.length > 0 && (
                                <Text size="sm" c="dimmed">
                                    This will create{" "}
                                    <strong>
                                        {Math.floor(
                                            ((parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1])) -
                                                (parseInt(startTime.split(":")[0]) * 60 + parseInt(startTime.split(":")[1]))) /
                                            parseInt(duration)
                                        ) * selectedDays.length}
                                    </strong>{" "}
                                    slots total
                                </Text>
                            )}
                        </>
                    ) : (
                        <>
                            <Select
                                label={resources.editorDayLabel}
                                placeholder={resources.editorDayPlaceholder}
                                data={dayOptions}
                                value={editWeekday}
                                onChange={setEditWeekday}
                                error={errors.weekday}
                                required
                            />

                            <Group grow>
                                <Select
                                    label={resources.editorStartTimeLabel}
                                    placeholder="Select time"
                                    data={timeOptions}
                                    value={editFromTime}
                                    onChange={setEditFromTime}
                                    error={errors.fromTime}
                                    required
                                    searchable
                                />
                                <Select
                                    label={resources.editorEndTimeLabel}
                                    placeholder="Select time"
                                    data={timeOptions}
                                    value={editToTime}
                                    onChange={setEditToTime}
                                    error={errors.toTime}
                                    required
                                    searchable
                                />
                            </Group>
                        </>
                    )}

                    {apiError && (
                        <Text c="red" size="sm">
                            {apiError}
                        </Text>
                    )}

                    <Group justify="flex-end" mt="md">
                        <Button variant="default" onClick={close}>
                            {resources.editorCancelButton}
                        </Button>
                        <Button type="submit" loading={isSubmitting}>
                            {mode === "create" ? resources.editorCreateButton : resources.editorSaveButton}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
