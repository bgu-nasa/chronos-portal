import { useState } from "react";
import { Container, Divider, Title } from "@mantine/core";
import { useNavigate } from "react-router";
import { ConfirmationDialog, useConfirmation } from "@/common";
import { SubjectActions } from "./components/subject-actions";
import { SubjectTable } from "./components/subject-table/subject-table";
import { SubjectSearch, type SubjectSearchFilters } from "./components/subject-search";
import { SubjectCreator } from "./components/subject-creator";
import { SubjectEditor } from "./components/subject-editor";
import type { SubjectData } from "./components/subject-table/types";
import type { UpdateSubjectRequest } from "@/modules/resources/src/data";
import {
    useSubjects,
    useCreateSubject,
    useUpdateSubject,
    useDeleteSubject,
} from "@/modules/resources/src/hooks";
import resources from "./subjects-page.resources.json";
import styles from "./subjects-page.module.css";
import { $app } from "@/infra/service";

export function SubjectsPage() {
    const navigate = useNavigate();
    const [selectedSubject, setSelectedSubject] = useState<SubjectData | null>(null);
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

    const handleSearch = (filters: SubjectSearchFilters) => {
        // TODO: Backend endpoint needed for filtered search
        // Expected endpoint: GET /api/department/{departmentId}/resources/subjects/subject
        // Query params: ?code={code}&name={name}
        
        if (!filters.departmentId) {
            $app.logger.warn("[SubjectsPage] Department ID is required for search");
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
            $app.notifications.showWarning("Warning", "Please search for a department first");
            return;
        }
        setCreateModalOpened(true);
    };

    const handleCreateSubmit = async (data: { code: string; name: string }) => {
        $app.logger.info("[SubjectsPage] handleCreateSubmit called with:", data);
        $app.logger.info("[SubjectsPage] currentDepartmentId:", currentDepartmentId);
        
        if (!currentDepartmentId) {
            $app.logger.error("[SubjectsPage] No department ID set");
            return;
        }

        // Get organization from context
        const org = $app.organization.getOrganization();
        $app.logger.info("[SubjectsPage] Organization from context:", org);

        // TODO: Get schedulingPeriodId from context (using placeholder for now)
        const request = {
            id: crypto.randomUUID(),
            organizationId: org?.id || "00000000-0000-0000-0000-000000000000",
            departmentId: currentDepartmentId,
            schedulingPeriodId: "00000000-0000-0000-0000-000000000000", // TODO: Get from context
            code: data.code,
            name: data.name,
        };

        $app.logger.info("[SubjectsPage] Sending create request:", request);

        try {
            const result = await createSubject(request);
            $app.logger.info("[SubjectsPage] Create subject result:", result);
            
            if (result) {
                setCreateModalOpened(false);
                fetchSubjects(); // Refresh the list
            } else {
                $app.logger.error("[SubjectsPage] Create subject returned null");
            }
        } catch (error) {
            $app.logger.error("[SubjectsPage] Error creating subject:", error);
        }
    };

    const handleEditClick = () => {
        if (selectedSubject) {
            setEditModalOpened(true);
        }
    };

    const handleEditSubmit = async (data: { code: string; name: string }) => {
        $app.logger.info("[SubjectsPage] handleEditSubmit called with:", data);
        $app.logger.info("[SubjectsPage] selectedSubject:", selectedSubject);
        $app.logger.info("[SubjectsPage] currentDepartmentId:", currentDepartmentId);
        
        if (!selectedSubject || !currentDepartmentId) {
            $app.logger.error("[SubjectsPage] Missing selectedSubject or currentDepartmentId");
            return;
        }

        // Get organization from context
        const org = $app.organization.getOrganization();
        $app.logger.info("[SubjectsPage] Organization from context:", org);

        // TODO: Get schedulingPeriodId from context (using placeholder for now)
        const request: UpdateSubjectRequest = {
            organizationId: org?.id || "00000000-0000-0000-0000-000000000000",
            departmentId: currentDepartmentId,
            schedulingPeriodId: selectedSubject.schedulingPeriodId, // Use existing value from subject
            code: data.code,
            name: data.name,
        };

        $app.logger.info("[SubjectsPage] Sending update request:", request);

        try {
            const success = await updateSubject(selectedSubject.id, request);
            $app.logger.info("[SubjectsPage] Update subject result:", success);
            
            if (success) {
                setEditModalOpened(false);
                setSelectedSubject(null);
                fetchSubjects(); // Refresh the list
            } else {
                $app.logger.error("[SubjectsPage] Update subject returned false");
            }
        } catch (error) {
            $app.logger.error("[SubjectsPage] Error updating subject:", error);
        }
    };

    const handleDeleteClick = () => {
        if (!selectedSubject) return;

        openConfirmation({
            title: resources.deleteConfirmTitle,
            message: resources.deleteConfirmMessage.replace(
                "{name}",
                selectedSubject.name
            ),
            onConfirm: async () => {
                const success = await deleteSubject(selectedSubject.id);
                if (success) {
                    setSelectedSubject(null);
                    fetchSubjects(); // Refresh the list
                }
            },
        });
    };

    const handleViewActivitiesClick = () => {
        if (selectedSubject && currentDepartmentId) {
            navigate(
                `/resources/activities?subjectId=${selectedSubject.id}&departmentId=${currentDepartmentId}`
            );
        }
    };

    // Convert SubjectResponse to SubjectData with display names
    // TODO: Fetch actual organization and department names from backend
    const subjectData: SubjectData[] = subjects.map((subject) => ({
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

                <SubjectSearch 
                    onSearch={handleSearch}
                    onClear={handleClearFilters}
                />

                <SubjectActions
                    selectedSubject={selectedSubject}
                    onCreateClick={handleCreateClick}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                    onViewActivitiesClick={handleViewActivitiesClick}
                />

                <SubjectTable
                    subjects={subjectData}
                    selectedSubject={selectedSubject}
                    onSelectionChange={setSelectedSubject}
                />

                <SubjectCreator
                    opened={createModalOpened}
                    onClose={() => setCreateModalOpened(false)}
                    onSubmit={handleCreateSubmit}
                    loading={isCreating}
                />

                <SubjectEditor
                    opened={editModalOpened}
                    onClose={() => setEditModalOpened(false)}
                    onSubmit={handleEditSubmit}
                    loading={isEditing}
                    initialData={
                        selectedSubject
                            ? { code: selectedSubject.code, name: selectedSubject.name }
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
