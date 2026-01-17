import { Button, Group } from "@mantine/core";
import resources from "../groups-page.resources.json";

interface GroupActionsProps {
    selectedGroup: any | null;
    onCreateClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
}

export function GroupActions({
    selectedGroup,
    onCreateClick,
    onEditClick,
    onDeleteClick,
}: GroupActionsProps) {
    return (
        <Group mb="md">
            <Button onClick={onCreateClick}>
                {resources.createButton}
            </Button>
            <Button 
                onClick={onEditClick} 
                disabled={!selectedGroup}
            >
                {resources.editButton}
            </Button>
            <Button 
                onClick={onDeleteClick} 
                disabled={!selectedGroup}
                color="red"
            >
                {resources.deleteButton}
            </Button>
        </Group>
    );
}
