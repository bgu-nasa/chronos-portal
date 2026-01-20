/**
 * Assignment Table Component
 * Displays assignments for a slot in a list format
 */

import { Paper, Text, Stack } from "@mantine/core";
import type { AssignmentResponse } from "@/modules/schedule/src/data/assignment.types";

interface AssignmentTableProps {
    assignments: AssignmentResponse[];
    selectedAssignment: AssignmentResponse | null;
    onSelectionChange: (assignment: AssignmentResponse | null) => void;
    isLoading?: boolean;
}

export function AssignmentTable({
    assignments,
    selectedAssignment,
    onSelectionChange,
    isLoading = false,
}: AssignmentTableProps) {
    if (isLoading) {
        return (
            <Paper p="xl" withBorder>
                <Text c="dimmed" ta="center">Loading assignments...</Text>
            </Paper>
        );
    }

    if (assignments.length === 0) {
        return (
            <Paper p="xl" withBorder>
                <Text c="dimmed" ta="center">No assignments found for this slot</Text>
            </Paper>
        );
    }

    return (
        <Stack gap="xs">
            {assignments.map((assignment) => (
                <Paper
                    key={assignment.id}
                    p="sm"
                    withBorder
                    onClick={() => onSelectionChange(
                        selectedAssignment?.id === assignment.id ? null : assignment
                    )}
                    style={{
                        cursor: "pointer",
                        backgroundColor: selectedAssignment?.id === assignment.id
                            ? "var(--mantine-primary-color-light)"
                            : undefined,
                        borderColor: selectedAssignment?.id === assignment.id
                            ? "var(--mantine-primary-color-filled)"
                            : undefined,
                    }}
                >
                    <Stack gap={4}>
                        <Text size="sm">
                            <Text span fw={500}>Resource:</Text> {assignment.resourceId}
                        </Text>
                        <Text size="sm">
                            <Text span fw={500}>Activity:</Text> {assignment.activityId}
                        </Text>
                    </Stack>
                </Paper>
            ))}
        </Stack>
    );
}
