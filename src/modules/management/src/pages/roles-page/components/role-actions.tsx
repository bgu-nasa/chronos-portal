import { Button } from "@mantine/core";
import resources from "@/modules/management/src/pages/roles-page/roles-page.resources.json";

interface RoleActionsProps {
    onCreateClick: () => void;
}

export function RoleActions({ onCreateClick }: RoleActionsProps) {
    return (
        <Button.Group mb="md">
            <Button onClick={onCreateClick}>{resources.createButton}</Button>
        </Button.Group>
    );
}
