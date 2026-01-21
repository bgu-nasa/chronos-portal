import { Button, Group } from "@mantine/core";
import resources from "../resources-page.resources.json";

interface ResourceActionsProps {
    selectedResource: any | null;
    onCreateClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
}

export function ResourceActions({
    selectedResource,
    onCreateClick,
    onEditClick,
    onDeleteClick,
}: ResourceActionsProps) {
    // Check if user has ResourceManager role for create/edit/delete operations
    const isResourceManager = $app.organization.isResourceManager();
    
    return (
        <Group mb="md">
            <Button 
                onClick={onCreateClick}
                disabled={!isResourceManager}
            >
                {resources.createButton}
            </Button>
            <Button
                onClick={onEditClick}
                disabled={!selectedResource || !isResourceManager}
                variant="outline"
            >
                {resources.editButton}
            </Button>
            <Button
                onClick={onDeleteClick}
                disabled={!selectedResource || !isResourceManager}
                variant="outline"
            >
                {resources.deleteButton}
            </Button>
        </Group>
    );
}
