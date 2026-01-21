import { Button, Group } from "@mantine/core";
import resources from "@/modules/schedule/src/pages/scheduling-periods-page/scheduling-periods-page.resources.json";

interface SchedulingPeriodActionsProps {
    selectedPeriod: any | null;
    isExpired: boolean;
    onCreateClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
    onViewSlotsClick: () => void;
}

export function SchedulingPeriodActions({
    selectedPeriod,
    isExpired,
    onCreateClick,
    onEditClick,
    onDeleteClick,
    onViewSlotsClick,
}: SchedulingPeriodActionsProps) {
    return (
        <Group mb="md">
            <Button onClick={onCreateClick}>
                {resources.createButton}
            </Button>
            <Button
                variant="light"
                onClick={onEditClick}
                disabled={!selectedPeriod || isExpired}
            >
                {resources.editButton}
            </Button>
            <Button
                variant="light"
                onClick={onDeleteClick}
                disabled={!selectedPeriod || isExpired}
            >
                {resources.deleteButton}
            </Button>
            <Button
                variant="light"
                onClick={onViewSlotsClick}
                disabled={!selectedPeriod}
            >
                View Slots
            </Button>
        </Group>
    );
}
