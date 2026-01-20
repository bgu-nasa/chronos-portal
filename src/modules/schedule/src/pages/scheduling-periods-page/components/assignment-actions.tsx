/**
 * Assignment Actions Component
 * Action buttons for assignment CRUD operations
 */

import { Button, Group } from "@mantine/core";
import type { AssignmentResponse } from "@/modules/schedule/src/data/assignment.types";

interface AssignmentActionsProps {
    selectedAssignment: AssignmentResponse | null;
    onCreateClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
}

export function AssignmentActions({
    selectedAssignment,
    onCreateClick,
    onEditClick,
    onDeleteClick,
}: AssignmentActionsProps) {
    return (
        <Group mb="md">
            <Button onClick={onCreateClick} size="sm">
                Add Assignment
            </Button>
            <Button
                variant="light"
                disabled={!selectedAssignment}
                onClick={onEditClick}
                size="sm"
            >
                Edit
            </Button>
            <Button
                variant="light"
                disabled={!selectedAssignment}
                onClick={onDeleteClick}
                size="sm"
            >
                Delete
            </Button>
        </Group>
    );
}

