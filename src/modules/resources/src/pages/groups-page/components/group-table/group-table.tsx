import { DataTable } from "primereact/datatable";
import type { DataTableSelectionSingleChangeEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Text, Stack } from "@mantine/core";
import type { GroupData } from "./types";
import resources from "../../groups-page.resources.json";

interface GroupTableProps {
    groups: GroupData[];
    selectedGroup: GroupData | null;
    onSelectionChange: (group: GroupData | null) => void;
}

export function GroupTable({
    groups,
    selectedGroup,
    onSelectionChange,
}: GroupTableProps) {
    const handleSelectionChange = (
        e: DataTableSelectionSingleChangeEvent<GroupData[]>
    ) => {
        onSelectionChange(e.value as GroupData | null);
    };

    const emptyMessage = () => {
        return (
            <Stack align="center" justify="center" style={{ padding: "3rem" }}>
                <Text size="lg" c="dimmed" ta="center">
                    {resources.emptyStateMessage}
                </Text>
            </Stack>
        );
    };

    return (
        <DataTable
            value={groups}
            selection={selectedGroup}
            onSelectionChange={handleSelectionChange}
            selectionMode="single"
            dataKey="id"
            stripedRows
            paginator
            rows={10}
            emptyMessage={emptyMessage()}
            pt={{
                root: { style: { backgroundColor: "transparent" } },
                wrapper: { style: { backgroundColor: "transparent" } },
                table: { style: { backgroundColor: "transparent" } },
            }}
        >
            <Column selectionMode="single" headerStyle={{ width: "3rem" }} />
            <Column field="activityType" header={resources.activityTypeColumn} sortable />
            <Column field="assignedUserId" header={resources.assignedUserColumn} sortable />
            <Column 
                field="expectedStudents" 
                header={resources.expectedStudentsColumn} 
                sortable 
                body={(rowData: GroupData) => rowData.expectedStudents ?? "N/A"}
            />
        </DataTable>
    );
}
