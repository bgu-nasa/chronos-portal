import { Button } from "@mantine/core";
import resources from "@/modules/schedule/src/pages/scheduling-periods-page/scheduling-periods-page.resources.json";

interface SchedulingPeriodActionsProps {
    selectedPeriod: any | null;
    onCreateClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
}

export function SchedulingPeriodActions({
    selectedPeriod,
    onCreateClick,
    onEditClick,
    onDeleteClick,
}: SchedulingPeriodActionsProps) {
    return (
        <Button.Group mb="md">
            <Button onClick={onCreateClick}>{resources.createButton}</Button>
            <Button onClick={onEditClick} disabled={!selectedPeriod}>
                {resources.editButton}
            </Button>
            <Button onClick={onDeleteClick} disabled={!selectedPeriod}>
                {resources.deleteButton}
            </Button>
        </Button.Group>
    );
}
