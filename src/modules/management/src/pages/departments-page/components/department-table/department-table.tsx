import { DataTable } from "primereact/datatable";
import type { DataTableSelectionSingleChangeEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "@mantine/core";
import type { DepartmentData } from "@/modules/management/src/pages/departments-page/components/department-table/types";
import resources from "@/modules/management/src/pages/departments-page/departments-page.resources.json";

interface DepartmentTableProps {
    departments: DepartmentData[];
    selectedDepartment: DepartmentData | null;
    onSelectionChange: (department: DepartmentData | null) => void;
}

export function DepartmentTable({
    departments,
    selectedDepartment,
    onSelectionChange,
}: DepartmentTableProps) {
    const handleSelectionChange = (
        e: DataTableSelectionSingleChangeEvent<DepartmentData[]>
    ) => {
        onSelectionChange(e.value as DepartmentData | null);
    };

    const statusTemplate = (rowData: DepartmentData) => {
        return (
            <Badge color={rowData.deleted ? "red" : "green"} variant="filled">
                {rowData.deleted ? resources.deleted : resources.active}
            </Badge>
        );
    };

    return (
        <DataTable
            value={departments}
            selection={selectedDepartment}
            onSelectionChange={handleSelectionChange}
            selectionMode="single"
            dataKey="id"
            stripedRows
            paginator
            rows={10}
        >
            <Column selectionMode="single" headerStyle={{ width: "3rem" }} />
            <Column field="name" header={resources.nameColumn} sortable />
            <Column
                field="deleted"
                header={resources.statusColumn}
                body={statusTemplate}
                sortable
            />
        </DataTable>
    );
}
