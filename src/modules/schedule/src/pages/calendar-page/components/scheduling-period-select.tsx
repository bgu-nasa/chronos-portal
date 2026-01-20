import { useEffect } from "react";
import { Select, Stack, Text } from "@mantine/core";
import { useSchedulingPeriods } from "@/modules/schedule/src/hooks/use-scheduling-periods";

interface SchedulingPeriodSelectProps {
    readonly value: string | null;
    readonly onChange: (value: string | null) => void;
}

export function SchedulingPeriodSelect({ value, onChange }: SchedulingPeriodSelectProps) {
    const { schedulingPeriods, isLoading, fetchSchedulingPeriods } = useSchedulingPeriods();

    useEffect(() => {
        void fetchSchedulingPeriods();
    }, [fetchSchedulingPeriods]);

    const data = schedulingPeriods.map((period) => ({
        value: period.id,
        label: period.name,
    }));

    return (
        <Stack gap="xs">
            <Text size="sm" fw={500}>
                Scheduling Period
            </Text>
            <Select
                placeholder="Select period"
                data={data}
                value={value}
                onChange={onChange}
                disabled={isLoading}
                nothingFoundMessage="No periods found"
                searchable
                clearable
            />
        </Stack>
    );
}
