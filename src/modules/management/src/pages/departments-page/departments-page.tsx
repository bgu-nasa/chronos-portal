import { useState } from "react";
import { Container, Divider, Title } from "@mantine/core";
import { DepartmentActions } from "@/modules/management/src/pages/departments-page/components/department-actions";
import { DepartmentTable } from "@/modules/management/src/pages/departments-page/components/department-table/department-table";
import type { DepartmentData } from "@/modules/management/src/pages/departments-page/components/department-table/types";
import resources from "@/modules/management/src/pages/departments-page/departments-page.resources.json";
import styles from "@/modules/management/src/pages/departments-page/departments-page.module.css";

// Mock data for testing the UI
const mockDepartments: DepartmentData[] = [
    {
        id: "1",
        name: "Human Resources",
        deleted: false,
    },
    {
        id: "2",
        name: "Engineering",
        deleted: false,
    },
    {
        id: "3",
        name: "Marketing",
        deleted: false,
    },
    {
        id: "4",
        name: "Sales",
        deleted: false,
    },
    {
        id: "5",
        name: "Finance",
        deleted: true,
    },
];

export function DepartmentsPage() {
    const [selectedDepartment, setSelectedDepartment] =
        useState<DepartmentData | null>(null);

    const handleCreateClick = () => {
        console.log("Create department clicked");
        // TODO: Implement create department logic
    };

    const handleEditClick = () => {
        console.log("Edit department clicked", selectedDepartment);
        // TODO: Implement edit department logic
    };

    const handleDeleteClick = () => {
        console.log("Delete department clicked", selectedDepartment);
        // TODO: Implement delete department logic
    };

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
                    departments={mockDepartments}
                    selectedDepartment={selectedDepartment}
                    onSelectionChange={setSelectedDepartment}
                />
            </div>
        </Container>
    );
}
