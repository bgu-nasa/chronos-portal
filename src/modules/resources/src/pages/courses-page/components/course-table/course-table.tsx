import { DataTable } from "primereact/datatable";
import type { DataTableSelectionSingleChangeEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Text, Stack } from "@mantine/core";
import type { CourseData } from "./types";
import resources from "../../courses-page.resources.json";

interface CourseTableProps {
    courses: CourseData[];
    selectedCourse: CourseData | null;
    onSelectionChange: (course: CourseData | null) => void;
}

export function CourseTable({
    courses,
    selectedCourse,
    onSelectionChange,
}: CourseTableProps) {
    const handleSelectionChange = (
        e: DataTableSelectionSingleChangeEvent<CourseData[]>
    ) => {
        onSelectionChange(e.value as CourseData | null);
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
            value={courses}
            selection={selectedCourse}
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
            <Column field="organizationName" header={resources.organizationColumn} sortable />
            <Column field="departmentName" header={resources.departmentColumn} sortable />
            <Column field="code" header={resources.codeColumn} sortable />
            <Column field="name" header={resources.nameColumn} sortable />
        </DataTable>
    );
}
