import { Button, Group } from "@mantine/core";
import resources from "../courses-page.resources.json";

interface CourseActionsProps {
    selectedCourse: any | null;
    onCreateClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
    onViewGroupsClick: () => void;
}

export function CourseActions({
    selectedCourse,
    onCreateClick,
    onEditClick,
    onDeleteClick,
    onViewGroupsClick,
}: CourseActionsProps) {
    return (
        <Group mb="md">
            <Button onClick={onCreateClick}>
                {resources.createButton}
            </Button>
            <Button 
                onClick={onEditClick} 
                disabled={!selectedCourse}
                variant="outline"
            >
                {resources.editButton}
            </Button>
            <Button 
                onClick={onDeleteClick} 
                disabled={!selectedCourse}
                color="red"
                variant="outline"
            >
                {resources.deleteButton}
            </Button>
            <Button 
                onClick={onViewGroupsClick} 
                disabled={!selectedCourse}
                variant="light"
            >
                {resources.viewGroupsButton}
            </Button>
        </Group>
    );
}
