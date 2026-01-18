import { useEffect, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, Group, Stack } from "@mantine/core";
import { useUserPreferences } from "@/modules/schedule/src/hooks/use-constraints";
import { useUsers } from "@/modules/auth/src/hooks/use-users";
import { useSchedulingPeriods } from "@/modules/schedule/src/hooks/use-scheduling-periods";
import { useConstraintEditorStore } from "@/modules/schedule/src/stores/constraint-editor.store";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";

export function UserPreferencesTable() {
    const { userPreferences, fetchUserPreferences, deleteUserPreference } = useUserPreferences();
    const { users, fetchUsers } = useUsers();
    const { schedulingPeriods, fetchSchedulingPeriods } = useSchedulingPeriods();
    const { openCreate, openEdit } = useConstraintEditorStore();

    useEffect(() => {
        fetchUserPreferences();
        fetchUsers();
        fetchSchedulingPeriods();
    }, []);

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
        <UserPreferenceActionsCell
            preference={rowData}
            onEdit={openEdit}
            onDelete={deleteUserPreference}
        />
    ), [openEdit, deleteUserPreference]);

    return (
        <Stack gap="md">
            <Group justify="flex-end">
                <Button
                    leftSection={<HiPlus size={16} />}
                    variant="filled"
                    onClick={() => openCreate("preference")}
                >
                    Add User Preference
                </Button>
            </Group>

            <DataTable
                value={userPreferences}
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
        </Stack>
    );
}

interface UserPreferenceActionsCellProps {
    readonly preference: any;
    readonly onEdit: (type: "preference", preference: any) => void;
    readonly onDelete: (id: string) => void;
}

function UserPreferenceActionsCell({ preference, onEdit, onDelete }: UserPreferenceActionsCellProps) {
    return (
        <Group gap="xs">
            <Button
                variant="subtle"
                color="blue"
                p={4}
                onClick={() => onEdit("preference", preference)}
            >
                <HiPencil size={16} />
            </Button>
            <Button
                variant="subtle"
                color="red"
                p={4}
                onClick={() => onDelete(preference.id)}
            >
                <HiTrash size={16} />
            </Button>
        </Group>
    );
}
