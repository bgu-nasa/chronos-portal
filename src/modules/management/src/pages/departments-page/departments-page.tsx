import { useEffect, useState } from "react";
import { Container, Divider, Title } from "@mantine/core";
import { DepartmentActions } from "@/modules/management/src/pages/departments-page/components/department-actions";
import { DepartmentTable } from "@/modules/management/src/pages/departments-page/components/department-table/department-table";
import { DepartmentEditor } from "@/modules/management/src/pages/departments-page/components/department-editor";
import type { DepartmentData } from "@/modules/management/src/pages/departments-page/components/department-table/types";
import { useDepartmentEditorStore } from "@/modules/management/src/stores/department-editor.store";
import { useDepartments } from "@/modules/management/src/hooks/use-departments";
import resources from "@/modules/management/src/pages/departments-page/departments-page.resources.json";
import styles from "@/modules/management/src/pages/departments-page/departments-page.module.css";

export function DepartmentsPage() {
    const [selectedDepartment, setSelectedDepartment] =
        useState<DepartmentData | null>(null);
    const { departments, fetchDepartments } = useDepartments();
    const { openCreate, openEdit } = useDepartmentEditorStore();

    // Fetch departments on mount
    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleCreateClick = () => {
        openCreate();
    };

    const handleEditClick = () => {
        if (selectedDepartment) {
            openEdit(selectedDepartment);
        }
    };

    const handleDeleteClick = () => {
        console.log("Delete department clicked", selectedDepartment);
        // TODO: Implement delete department logic
    };

    const handleEditorSuccess = () => {
        // Refresh the departments list after successful create/edit
        fetchDepartments();
        setSelectedDepartment(null);
    };

    // Convert DepartmentResponse to DepartmentData
    const departmentData: DepartmentData[] = departments.map((dept) => ({
        id: dept.id,
        name: dept.name,
        deleted: dept.deleted,
    }));

    return (
        <Container size="xl" py="xl">
            <div className={styles.container}>
                <Title order={1}>{resources.title}</Title>
                <Divider className={styles.divider} />

                <DepartmentActions
                    selectedDepartment={selectedDepartment}
                    onCreateClick={handleCreateClick}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                />

                <DepartmentTable
                    departments={departmentData}
                    selectedDepartment={selectedDepartment}
                    onSelectionChange={setSelectedDepartment}
                />

                <DepartmentEditor onSuccess={handleEditorSuccess} />
            </div>
        </Container>
    );
}
