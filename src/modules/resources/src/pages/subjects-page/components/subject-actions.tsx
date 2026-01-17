import { Button, Group } from "@mantine/core";
import resources from "../subjects-page.resources.json";

interface SubjectActionsProps {
    selectedSubject: any | null;
    onCreateClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
    onViewActivitiesClick: () => void;
}

export function SubjectActions({
    selectedSubject,
    onCreateClick,
    onEditClick,
    onDeleteClick,
    onViewActivitiesClick,
}: SubjectActionsProps) {
    return (
        <Group mb="md">
            <Button onClick={onCreateClick}>
                {resources.createButton}
            </Button>
            <Button 
                onClick={onEditClick} 
                disabled={!selectedSubject}
                variant="outline"
            >
                {resources.editButton}
            </Button>
            <Button 
                onClick={onDeleteClick} 
                disabled={!selectedSubject}
                variant="outline"
            >
                {resources.deleteButton}
            </Button>
            <Button 
                onClick={onViewActivitiesClick} 
                disabled={!selectedSubject}
                variant="light"
            >
                {resources.viewActivitiesButton}
            </Button>
        </Group>
    );
}
