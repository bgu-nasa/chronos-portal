import { Button, Tooltip } from "@mantine/core";
import resources from "@/modules/auth/src/pages/users/users-page.resources.json";

interface UserActionsProps {
    selectedUser: any | null;
    onCreateClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
}

export function UserActions({
    selectedUser, // will be used in the future
    onCreateClick,
    onEditClick,
    onDeleteClick,
}: UserActionsProps) {
    return (
        <Button.Group mb="md">
            <Button onClick={onCreateClick}>{resources.createButton}</Button>
            <Tooltip label={resources.underDevelopmentTooltip}>
                <Button onClick={onEditClick} disabled>
                    {resources.editButton}
                </Button>
            </Tooltip>
            <Tooltip label={resources.underDevelopmentTooltip}>
                <Button onClick={onDeleteClick} disabled>
                    {resources.deleteButton}
                </Button>
            </Tooltip>
        </Button.Group>
    );
}
