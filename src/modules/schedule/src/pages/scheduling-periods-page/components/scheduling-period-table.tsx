import { DataTable } from "primereact/datatable";
import type { DataTableSelectionSingleChangeEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Text, Stack } from "@mantine/core";
import type { SchedulingPeriodData } from "@/modules/schedule/src/stores/scheduling-period-editor.store";
import resources from "@/modules/schedule/src/pages/scheduling-periods-page/scheduling-periods-page.resources.json";

interface SchedulingPeriodTableProps {
    schedulingPeriods: SchedulingPeriodData[];
    selectedPeriod: SchedulingPeriodData | null;
    onSelectionChange: (period: SchedulingPeriodData | null) => void;
}

export function SchedulingPeriodTable({
    schedulingPeriods,
    selectedPeriod,
    onSelectionChange,
}: SchedulingPeriodTableProps) {
    const handleSelectionChange = (
        e: DataTableSelectionSingleChangeEvent<SchedulingPeriodData[]>
    ) => {
        onSelectionChange(e.value as SchedulingPeriodData | null);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const fromDateTemplate = (rowData: SchedulingPeriodData) => {
        return formatDate(rowData.fromDate);
    };

    const toDateTemplate = (rowData: SchedulingPeriodData) => {
        return formatDate(rowData.toDate);
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
            value={schedulingPeriods}
            selection={selectedPeriod}
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
            <Column field="name" header={resources.nameColumn} sortable />
            <Column
                field="fromDate"
                header={resources.fromDateColumn}
                body={fromDateTemplate}
                sortable
            />
            <Column
                field="toDate"
                header={resources.toDateColumn}
                body={toDateTemplate}
                sortable
            />
        </DataTable>
    );
}
