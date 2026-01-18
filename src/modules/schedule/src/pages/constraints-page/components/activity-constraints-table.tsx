import { useEffect, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, Group, Stack } from "@mantine/core";
import { useActivityConstraints } from "@/modules/schedule/src/hooks/use-constraints";
import { useActivities } from "@/modules/resources/src/hooks/use-activities";
import { useSubjects } from "@/modules/resources/src/hooks/use-subjects";
import { useConstraintEditorStore } from "@/modules/schedule/src/stores/constraint-editor.store";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";

export function ActivityConstraintsTable() {
    const { activityConstraints, fetchActivityConstraints, deleteActivityConstraint } = useActivityConstraints();
    const { activities, fetchActivities } = useActivities();
    const { subjects, fetchSubjects } = useSubjects();
    const { openCreate, openEdit } = useConstraintEditorStore();

    useEffect(() => {
        fetchActivityConstraints();
        fetchActivities();
        fetchSubjects();
    }, [fetchActivityConstraints, fetchActivities, fetchSubjects]);

    const activityNameTemplate = useCallback((rowData: any) => {
        const activity = activities.find(a => a.id === rowData.activityId);
        if (!activity) return rowData.activityId;

        const subject = subjects.find(s => s.id === activity.subjectId);
        const subjectName = subject ? subject.name : "Unknown Subject";
        return `${subjectName} - ${activity.activityType}`;
    }, [activities, subjects]);

    const valueTemplate = useCallback((rowData: any) => {
        let displayValue = rowData.value;

        // Try to parse as JSON to check for user/period IDs
        try {
            const parsed = JSON.parse(displayValue);
            if (typeof parsed === 'object') {
                displayValue = JSON.stringify(parsed, null, 2);
            }
        } catch {
            // Not JSON, just return as-is
        }

        return displayValue;
    }, []);

    const actionsTemplate = useCallback((rowData: any) => (
        <ActivityActionsCell
            constraint={rowData}
            onEdit={openEdit}
            onDelete={deleteActivityConstraint}
        />
    ), [openEdit, deleteActivityConstraint]);

    return (
        <Stack gap="md">
            <Group justify="flex-end">
                <Button
                    leftSection={<HiPlus size={16} />}
                    variant="filled"
                    onClick={() => openCreate("activity")}
                >
                    Add Activity Constraint
                </Button>
            </Group>

            <DataTable
                value={activityConstraints}
                dataKey="id"
                stripedRows
                paginator
                rows={10}
            >
                <Column body={activityNameTemplate} header="Activity" sortable />
                <Column field="key" header="Key" sortable />
                <Column body={valueTemplate} header="Value" sortable />
                <Column body={actionsTemplate} header="Actions" />
            </DataTable>
        </Stack>
    );
}

interface ActivityActionsCellProps {
    readonly constraint: any;
    readonly onEdit: (type: "activity", constraint: any) => void;
    readonly onDelete: (id: string) => void;
}

function ActivityActionsCell({ constraint, onEdit, onDelete }: ActivityActionsCellProps) {
    return (
        <Group gap="xs">
            <Button
                variant="subtle"
                color="blue"
                p={4}
                onClick={() => onEdit("activity", constraint)}
            >
                <HiPencil size={16} />
            </Button>
            <Button
                variant="subtle"
                color="red"
                p={4}
                onClick={() => onDelete(constraint.id)}
            >
                <HiTrash size={16} />
            </Button>
        </Group>
    );
}
