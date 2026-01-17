import { useMemo } from "react";
import { Paper, Text, Group, Stack, Badge } from "@mantine/core";
import { getWeekdayName, Weekday, WeekdayFromString } from "@/modules/schedule/src/data/slot.types";
import type { SlotResponse } from "@/modules/schedule/src/data/slot.types";
import resources from "@/modules/schedule/src/pages/slots-page/slots-page.resources.json";

interface SlotTableProps {
    slots: SlotResponse[];
    selectedSlot: SlotResponse | null;
    onSelectionChange: (slot: SlotResponse | null) => void;
}

// Order of days (Sunday first)
const dayOrder = [
    Weekday.Sunday,
    Weekday.Monday,
    Weekday.Tuesday,
    Weekday.Wednesday,
    Weekday.Thursday,
    Weekday.Friday,
    Weekday.Saturday,
];

export function SlotTable({
    slots,
    selectedSlot,
    onSelectionChange,
}: SlotTableProps) {
    // Group slots by day and sort by time within each day
    const groupedSlots = useMemo(() => {
        const groups: Record<number, SlotResponse[]> = {};

        // Initialize groups for all days
        dayOrder.forEach((day) => {
            groups[day] = [];
        });

        // Group slots by weekday
        slots.forEach((slot) => {
            let weekdayNum: number;
            if (typeof slot.weekday === "string") {
                weekdayNum = WeekdayFromString[slot.weekday] ?? 0;
            } else {
                weekdayNum = slot.weekday;
            }
            if (!groups[weekdayNum]) {
                groups[weekdayNum] = [];
            }
            groups[weekdayNum].push(slot);
        });

        // Sort slots within each day by fromTime
        Object.keys(groups).forEach((day) => {
            groups[Number(day)].sort((a, b) => a.fromTime.localeCompare(b.fromTime));
        });

        return groups;
    }, [slots]);

    // Format time for display (remove seconds if present)
    const formatTime = (time: string) => {
        const parts = time.split(":");
        return `${parts[0]}:${parts[1]}`;
    };

    if (slots.length === 0) {
        return (
            <Paper p="xl" withBorder>
                <Text c="dimmed" ta="center">{resources.tableEmptyState}</Text>
            </Paper>
        );
    }

    return (
        <Stack gap="md">
            {dayOrder.map((day) => {
                const daySlots = groupedSlots[day];
                if (daySlots.length === 0) return null;

                return (
                    <Paper key={day} p="sm" withBorder>
                        <Text fw={600} size="sm" mb="xs" c="violet">
                            {getWeekdayName(day)}
                        </Text>
                        <Group gap="xs" wrap="wrap">
                            {daySlots.map((slot) => (
                                <Badge
                                    key={slot.id}
                                    size="lg"
                                    radius="sm"
                                    variant={selectedSlot?.id === slot.id ? "filled" : "light"}
                                    color={selectedSlot?.id === slot.id ? "violet" : "gray"}
                                    onClick={() => onSelectionChange(
                                        selectedSlot?.id === slot.id ? null : slot
                                    )}
                                    style={{ cursor: "pointer" }}
                                >
                                    {formatTime(slot.fromTime)} - {formatTime(slot.toTime)}
                                </Badge>
                            ))}
                        </Group>
                    </Paper>
                );
            })}
        </Stack>
    );
}
