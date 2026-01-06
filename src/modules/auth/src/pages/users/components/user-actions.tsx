import { Button, Group } from "@mantine/core";
import resources from "@/modules/auth/src/pages/users/users-page.resources.json";

interface UserActionsProps {
    selectedUser: any | null;
    onCreateClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
}

export function UserActions({
    selectedUser,
    onCreateClick,
    onEditClick,
    onDeleteClick,
}: UserActionsProps) {
    return (
        <Group mb="md">
            <Button onClick={onCreateClick}>{resources.createButton}</Button>
            <Button onClick={onEditClick} disabled={!selectedUser}>
                {resources.editButton}
            </Button>
            <Button
                onClick={onDeleteClick}
                disabled={!selectedUser}
                color="red"
            >
                {resources.deleteButton}
            </Button>
        </Group>
    );
}
