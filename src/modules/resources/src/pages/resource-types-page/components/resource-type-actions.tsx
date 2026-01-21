import { Button, Group } from "@mantine/core";
import resources from "../resource-types-page.resources.json";

interface ResourceTypeActionsProps {
    selectedResourceType: any | null;
    onCreateClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
}

export function ResourceTypeActions({
    selectedResourceType,
    onCreateClick,
    onEditClick,
    onDeleteClick,
}: ResourceTypeActionsProps) {
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
                disabled={!selectedResourceType || !isResourceManager}
                variant="outline"
            >
                {resources.editButton}
            </Button>
            <Button
                onClick={onDeleteClick}
                disabled={!selectedResourceType || !isResourceManager}
                variant="outline"
            >
                {resources.deleteButton}
            </Button>
        </Group>
    );
}
