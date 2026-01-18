import { useEffect, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, Group, Stack } from "@mantine/core";
import { useUserConstraints } from "@/modules/schedule/src/hooks/use-constraints";
import { useUsers } from "@/modules/auth/src/hooks/use-users";
import { useSchedulingPeriods } from "@/modules/schedule/src/hooks/use-scheduling-periods";
import { useConstraintEditorStore } from "@/modules/schedule/src/stores/constraint-editor.store";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";

export function UserConstraintsTable() {
    const { userConstraints, fetchUserConstraints, deleteUserConstraint } = useUserConstraints();
    const { users, fetchUsers } = useUsers();
    const { schedulingPeriods, fetchSchedulingPeriods } = useSchedulingPeriods();
    const { openCreate, openEdit } = useConstraintEditorStore();

    useEffect(() => {
        fetchUserConstraints();
        fetchUsers();
        fetchSchedulingPeriods();
    }, [fetchUserConstraints, fetchUsers, fetchSchedulingPeriods]);

    const userNameTemplate = useCallback((rowData: any) => {
        const user = users.find(u => u.id === rowData.userId);
        return user ? `${user.firstName} ${user.lastName}` : rowData.userId;
    }, [users]);

    const periodNameTemplate = useCallback((rowData: any) => {
        const period = schedulingPeriods.find(p => p.id === rowData.schedulingPeriodId);
        return period ? period.name : rowData.schedulingPeriodId;
    }, [schedulingPeriods]);

    const valueTemplate = useCallback((rowData: any) => {
        let displayValue = rowData.value;

        // Try to parse as JSON to check for user/period IDs
        try {
            const parsed = JSON.parse(displayValue);
            if (typeof parsed === 'object') {
                displayValue = JSON.stringify(parsed, null, 2);
            }
        } catch {
            // Not JSON, check if it's a GUID (user ID or period ID)
            const guidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
            displayValue = displayValue.replaceAll(guidRegex, (guid: string) => {
                // Check if it's a user ID
                const user = users.find(u => u.id.toLowerCase() === guid.toLowerCase());
                if (user) return `${user.firstName} ${user.lastName}`;

                // Check if it's a scheduling period ID
                const period = schedulingPeriods.find(p => p.id.toLowerCase() === guid.toLowerCase());
                if (period) return period.name;

                return guid;
            });
        }

        return displayValue;
    }, [users, schedulingPeriods]);

    const actionsTemplate = useCallback((rowData: any) => (
        <UserConstraintActionsCell
            constraint={rowData}
            onEdit={openEdit}
            onDelete={deleteUserConstraint}
        />
    ), [openEdit, deleteUserConstraint]);

    // Don't render table until all data is loaded to prevent showing IDs
    const isDataReady = users.length > 0 && schedulingPeriods.length > 0;

    return (
        <Stack gap="md">
            <Group justify="flex-end">
                <Button
                    leftSection={<HiPlus size={16} />}
                    variant="filled"
                    onClick={() => openCreate("user")}
                >
                    Add User Constraint
                </Button>
            </Group>

            {isDataReady ? (
                <DataTable
                    value={userConstraints}
                    dataKey="id"
                    stripedRows
                    paginator
                    rows={10}
                >
                    <Column body={periodNameTemplate} header="Scheduling Period" sortable />
                    <Column body={userNameTemplate} header="User" sortable />
                    <Column field="key" header="Key" sortable />
                    <Column body={valueTemplate} header="Value" sortable />
                    <Column body={actionsTemplate} header="Actions" />
                </DataTable>
            ) : (
                <div>Loading...</div>
            )}
        </Stack>
    );
}

interface UserConstraintActionsCellProps {
    readonly constraint: any;
    readonly onEdit: (type: "user", constraint: any) => void;
    readonly onDelete: (id: string) => void;
}

function UserConstraintActionsCell({ constraint, onEdit, onDelete }: UserConstraintActionsCellProps) {
    return (
        <Group gap="xs">
            <Button
                variant="subtle"
                color="blue"
                p={4}
                onClick={() => onEdit("user", constraint)}
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
