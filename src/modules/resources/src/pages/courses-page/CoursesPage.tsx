import { useState } from "react";
import { Container, Divider, Title, Alert } from "@mantine/core";
import { useNavigate } from "react-router";
import { ConfirmationDialog, useConfirmation } from "@/common";
import { CourseActions } from "./components/course-actions";
import { CourseTable } from "./components/course-table/course-table";
import { CourseSearch, type CourseSearchFilters } from "./components/course-search";
import { CourseCreator } from "./components/course-creator";
import { CourseEditor } from "./components/course-editor";
import type { CourseData } from "./components/course-table/types";
import type { UpdateSubjectRequest } from "@/modules/resources/src/data";
import {
    useSubjects,
    useCreateSubject,
    useUpdateSubject,
    useDeleteSubject,
} from "@/modules/resources/src/hooks";
import resources from "./courses-page.resources.json";
import styles from "./courses-page.module.css";

export function CoursesPage() {
    const navigate = useNavigate();
    const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
    const [createModalOpened, setCreateModalOpened] = useState(false);
    const [editModalOpened, setEditModalOpened] = useState(false);
    const [currentDepartmentId, setCurrentDepartmentId] = useState<string | null>(null);
    
    const { subjects, fetchSubjects, setCurrentDepartment } = useSubjects();
    const { createSubject, isLoading: isCreating } = useCreateSubject();
    const { updateSubject, isLoading: isEditing } = useUpdateSubject();
    const { deleteSubject } = useDeleteSubject();
    
    const {
        confirmationState,
        openConfirmation,
        closeConfirmation,
        handleConfirm,
        isLoading: isDeleting,
    } = useConfirmation();

    const handleSearch = (filters: CourseSearchFilters) => {
        // TODO: Backend endpoint needed for filtered search
        // Expected endpoint: GET /api/department/{departmentId}/resources/subjects/subject
        // Query params: ?code={code}&name={name}
        
        if (!filters.departmentId) {
            console.warn("Department ID is required for search");
            return;
        }

        setCurrentDepartmentId(filters.departmentId);
        setCurrentDepartment(filters.departmentId);
        fetchSubjects();
    };

    const handleClearFilters = () => {
        // Refetch without filters
        if (currentDepartmentId) {
            fetchSubjects();
        }
    };

    const handleCreateClick = () => {
        if (!currentDepartmentId) {
            alert("Please search for a department first");
            return;
        }
        setCreateModalOpened(true);
    };

    const handleCreateSubmit = async (data: { code: string; name: string }) => {
        console.log("🔵 handleCreateSubmit called with:", data);
        console.log("🔵 currentDepartmentId:", currentDepartmentId);
        
        if (!currentDepartmentId) {
            console.error("❌ No department ID set");
            return;
        }

        // Get organization from context
        const org = $app.organization.getOrganization();
        console.log("🔵 Organization from context:", org);

        // TODO: Get schedulingPeriodId from context (using placeholder for now)
        const request = {
            id: crypto.randomUUID(),
            organizationId: org?.id || "00000000-0000-0000-0000-000000000000",
            departmentId: currentDepartmentId,
            schedulingPeriodId: "00000000-0000-0000-0000-000000000000", // TODO: Get from context
            code: data.code,
            name: data.name,
        };

        console.log("🔵 Sending create request:", request);

        try {
            const result = await createSubject(request);
            console.log("✅ Create subject result:", result);
            
            if (result) {
                setCreateModalOpened(false);
                fetchSubjects(); // Refresh the list
            } else {
                console.error("❌ Create subject returned null");
            }
        } catch (error) {
            console.error("❌ Error creating subject:", error);
        }
    };

    const handleEditClick = () => {
        if (selectedCourse) {
            setEditModalOpened(true);
        }
    };

    const handleEditSubmit = async (data: { code: string; name: string }) => {
        console.log("🟣 handleEditSubmit called with:", data);
        console.log("🟣 selectedCourse:", selectedCourse);
        console.log("🟣 currentDepartmentId:", currentDepartmentId);
        
        if (!selectedCourse || !currentDepartmentId) {
            console.error("❌ Missing selectedCourse or currentDepartmentId");
            return;
        }

        // Get organization from context
        const org = $app.organization.getOrganization();
        console.log("🟣 Organization from context:", org);

        // TODO: Get schedulingPeriodId from context (using placeholder for now)
        const request: UpdateSubjectRequest = {
            organizationId: org?.id || "00000000-0000-0000-0000-000000000000",
            departmentId: currentDepartmentId,
            schedulingPeriodId: selectedCourse.schedulingPeriodId, // Use existing value from course
            code: data.code,
            name: data.name,
        };

        console.log("🟣 Sending update request:", request);

        try {
            const success = await updateSubject(selectedCourse.id, request);
            console.log("✅ Update subject result:", success);
            
            if (success) {
                setEditModalOpened(false);
                setSelectedCourse(null);
                fetchSubjects(); // Refresh the list
            } else {
                console.error("❌ Update subject returned false");
            }
        } catch (error) {
            console.error("❌ Error updating subject:", error);
        }
    };

    const handleDeleteClick = () => {
        if (!selectedCourse) return;

        openConfirmation({
            title: resources.deleteConfirmTitle,
            message: resources.deleteConfirmMessage.replace(
                "{name}",
                selectedCourse.name
            ),
            onConfirm: async () => {
                const success = await deleteSubject(selectedCourse.id);
                if (success) {
                    setSelectedCourse(null);
                    fetchSubjects(); // Refresh the list
                }
            },
        });
    };

    const handleViewGroupsClick = () => {
        if (selectedCourse && currentDepartmentId) {
            navigate(
                `/resources/groups?courseId=${selectedCourse.id}&courseName=${encodeURIComponent(selectedCourse.name)}&departmentId=${currentDepartmentId}`
            );
        }
    };

    // Convert SubjectResponse to CourseData with display names
    // TODO: Fetch actual organization and department names from backend
    const courseData: CourseData[] = subjects.map((subject) => ({
        id: subject.id,
        code: subject.code,
        name: subject.name,
        organizationName: "Organization", // TODO: Fetch from backend
        departmentName: "Department", // TODO: Fetch from backend
        departmentId: subject.departmentId,
        schedulingPeriodId: subject.schedulingPeriodId,
    }));

    return (
        <Container size="xl" py="xl">
            <div className={styles.container}>
                <Title order={1}>{resources.title}</Title>
                <Divider className={styles.divider} />

                <Alert color="yellow" title="Backend Connected" mb="md">
                    Using backend API. Search for a department to view courses.
                </Alert>

                <CourseSearch 
                    onSearch={handleSearch}
                    onClear={handleClearFilters}
                />

                <CourseActions
                    selectedCourse={selectedCourse}
                    onCreateClick={handleCreateClick}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                    onViewGroupsClick={handleViewGroupsClick}
                />

                <CourseTable
                    courses={courseData}
                    selectedCourse={selectedCourse}
                    onSelectionChange={setSelectedCourse}
                />

                <CourseCreator
                    opened={createModalOpened}
                    onClose={() => setCreateModalOpened(false)}
                    onSubmit={handleCreateSubmit}
                    loading={isCreating}
                />

                <CourseEditor
                    opened={editModalOpened}
                    onClose={() => setEditModalOpened(false)}
                    onSubmit={handleEditSubmit}
                    loading={isEditing}
                    initialData={
                        selectedCourse
                            ? { code: selectedCourse.code, name: selectedCourse.name }
                            : undefined
                    }
                />

                <ConfirmationDialog
                    opened={confirmationState.isOpen}
                    onClose={closeConfirmation}
                    onConfirm={handleConfirm}
                    title={confirmationState.title}
                    message={confirmationState.message}
                    confirmText={resources.deleteConfirmButton}
                    cancelText={resources.deleteCancelButton}
                    loading={isDeleting}
                />
            </div>
        </Container>
    );
}
