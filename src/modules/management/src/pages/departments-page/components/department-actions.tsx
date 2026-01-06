import { Button, Tooltip } from "@mantine/core";
import resources from "@/modules/management/src/pages/departments-page/departments-page.resources.json";

interface DepartmentActionsProps {
    selectedDepartment: any | null;
    onCreateClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
}

export function DepartmentActions({
    selectedDepartment, // will be used in the future
    onCreateClick,
    onEditClick,
    onDeleteClick,
}: DepartmentActionsProps) {
    return (
        <Button.Group mb="md">
            <Button onClick={onCreateClick}>{resources.createButton}</Button>
            <Button onClick={onEditClick} disabled={!selectedDepartment}>
                {resources.editButton}
            </Button>
            <Tooltip label={resources.underDevelopmentTooltip}>
                <Button onClick={onDeleteClick} disabled>
                    {resources.deleteButton}
                </Button>
            </Tooltip>
        </Button.Group>
    );
}
