import { Button, Group } from "@mantine/core";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import type { SlotResponse } from "@/modules/schedule/src/data/slot.types";
import resources from "@/modules/schedule/src/pages/slots-page/slots-page.resources.json";

interface SlotActionsProps {
    selectedSlot: SlotResponse | null;
    onCreateClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
}

export function SlotActions({
    selectedSlot,
    onCreateClick,
    onEditClick,
    onDeleteClick,
}: SlotActionsProps) {
    return (
        <Group mb="md">
            <Button
                leftSection={<HiOutlinePlus size={16} />}
                onClick={onCreateClick}
            >
                {resources.createButton}
            </Button>
            <Button
                variant="light"
                leftSection={<HiOutlinePencil size={16} />}
                disabled={!selectedSlot}
                onClick={onEditClick}
            >
                {resources.editButton}
            </Button>
            <Button
                variant="light"
                leftSection={<HiOutlineTrash size={16} />}
                disabled={!selectedSlot}
                onClick={onDeleteClick}
            >
                {resources.deleteButton}
            </Button>
        </Group>
    );
}
