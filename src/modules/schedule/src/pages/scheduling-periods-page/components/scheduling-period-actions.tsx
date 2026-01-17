import { Button, Group } from "@mantine/core";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineViewList } from "react-icons/hi";
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
            <Button leftSection={<HiOutlinePlus size={16} />} onClick={onCreateClick}>
                {resources.createButton}
            </Button>
            <Button
                variant="light"
                leftSection={<HiOutlinePencil size={16} />}
                onClick={onEditClick}
                disabled={!selectedPeriod || isExpired}
            >
                {resources.editButton}
            </Button>
            <Button
                variant="light"
                color="red"
                leftSection={<HiOutlineTrash size={16} />}
                onClick={onDeleteClick}
                disabled={!selectedPeriod || isExpired}
            >
                {resources.deleteButton}
            </Button>
            <Button
                variant="light"
                color="violet"
                leftSection={<HiOutlineViewList size={16} />}
                onClick={onViewSlotsClick}
                disabled={!selectedPeriod}
            >
                View Slots
            </Button>
        </Group>
    );
}
