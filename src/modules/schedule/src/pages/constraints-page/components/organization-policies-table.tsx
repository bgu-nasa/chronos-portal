import { useEffect, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, Group, Stack } from "@mantine/core";
import { useOrganizationPolicies } from "@/modules/schedule/src/hooks/use-constraints";
import { useSchedulingPeriods } from "@/modules/schedule/src/hooks/use-scheduling-periods";
import { useConstraintEditorStore } from "@/modules/schedule/src/stores/constraint-editor.store";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";

export function OrganizationPoliciesTable() {
    const { organizationPolicies, fetchOrganizationPolicies, deleteOrganizationPolicy } = useOrganizationPolicies();
    const { schedulingPeriods, fetchSchedulingPeriods } = useSchedulingPeriods();
    const { openCreate, openEdit } = useConstraintEditorStore();

    useEffect(() => {
        fetchOrganizationPolicies();
        fetchSchedulingPeriods();
    }, []);

    const periodNameTemplate = useCallback((rowData: any) => {
        const period = schedulingPeriods.find(p => p.id === rowData.schedulingPeriodId);
        return period ? period.name : rowData.schedulingPeriodId;
    }, [schedulingPeriods]);

    const valueTemplate = useCallback((rowData: any) => {
        let displayValue = rowData.value;

        // Try to parse as JSON to check for period IDs
        try {
            const parsed = JSON.parse(displayValue);
            if (typeof parsed === 'object') {
                displayValue = JSON.stringify(parsed, null, 2);
            }
        } catch {
            // Not JSON, check if it's a GUID (period ID)
            const guidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
            displayValue = displayValue.replaceAll(guidRegex, (guid: string) => {
                // Check if it's a scheduling period ID
                const period = schedulingPeriods.find(p => p.id.toLowerCase() === guid.toLowerCase());
                if (period) return period.name;

                return guid;
            });
        }

        return displayValue;
    }, [schedulingPeriods]);

    const actionsTemplate = useCallback((rowData: any) => (
        <PolicyActionsCell
            policy={rowData}
            onEdit={openEdit}
            onDelete={deleteOrganizationPolicy}
        />
    ), [openEdit, deleteOrganizationPolicy]);

    return (
        <Stack gap="md">
            <Group justify="flex-end">
                <Button
                    leftSection={<HiPlus size={16} />}
                    variant="filled"
                    onClick={() => openCreate("policy")}
                >
                    Add Organization Policy
                </Button>
            </Group>

            <DataTable
                value={organizationPolicies}
                dataKey="id"
                stripedRows
                paginator
                rows={10}
            >
                <Column body={periodNameTemplate} header="Scheduling Period" sortable />
                <Column field="key" header="Key" sortable />
                <Column body={valueTemplate} header="Value" sortable />
                <Column body={actionsTemplate} header="Actions" />
            </DataTable>
        </Stack>
    );
}

interface PolicyActionsCellProps {
    readonly policy: any;
    readonly onEdit: (type: "policy", policy: any) => void;
    readonly onDelete: (id: string) => void;
}

function PolicyActionsCell({ policy, onEdit, onDelete }: PolicyActionsCellProps) {
    return (
        <Group gap="xs">
            <Button
                variant="subtle"
                color="blue"
                p={4}
                onClick={() => onEdit("policy", policy)}
            >
                <HiPencil size={16} />
            </Button>
            <Button
                variant="subtle"
                color="red"
                p={4}
                onClick={() => onDelete(policy.id)}
            >
                <HiTrash size={16} />
            </Button>
        </Group>
    );
}
