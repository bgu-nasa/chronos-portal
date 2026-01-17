import { useEffect, useState } from "react";
import { Container, Divider, Title, Button, Alert, Text, Group } from "@mantine/core";
import { useNavigate, useSearchParams } from "react-router";
import { ConfirmationDialog, useConfirmation } from "@/common";
import { GroupActions } from "./components/group-actions";
import { GroupTable } from "./components/group-table/group-table";
import { GroupCreator } from "./components/group-creator";
import { GroupEditor } from "./components/group-editor";
import type { GroupData } from "./components/group-table/types";
import type { CreateActivityRequest, UpdateActivityRequest } from "@/modules/resources/src/data";
import {
    useActivities,
    useCreateActivity,
    useUpdateActivity,
    useDeleteActivity,
} from "@/modules/resources/src/hooks";
import resources from "./groups-page.resources.json";
import styles from "./groups-page.module.css";

export function GroupsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get("courseId");
    const courseName = searchParams.get("courseName");
    const departmentId = searchParams.get("departmentId"); // Get from URL
    
    const [selectedGroup, setSelectedGroup] = useState<GroupData | null>(null);
    const [createModalOpened, setCreateModalOpened] = useState(false);
    const [editModalOpened, setEditModalOpened] = useState(false);
    
    const { activities, fetchActivities, setCurrentDepartment, isLoading } = useActivities();
    const { createActivity, isLoading: isCreating } = useCreateActivity();
    const { updateActivity, isLoading: isEditing } = useUpdateActivity();
    const { deleteActivity } = useDeleteActivity();
    
    const {
        confirmationState,
        openConfirmation,
        closeConfirmation,
        handleConfirm,
        isLoading: isConfirming,
    } = useConfirmation();

    // Load activities when page loads
    useEffect(() => {
        console.log("🔷 [GroupsPage] Initializing with:", { courseId, departmentId });
        
        if (departmentId) {
            setCurrentDepartment(departmentId);
            fetchActivities();
        } else {
            console.warn("🔷 [GroupsPage] No departmentId in URL params");
        }
    }, [departmentId, fetchActivities, setCurrentDepartment]);

    const handleBackClick = () => {
        navigate("/resources/courses");
    };

    const handleCreateClick = () => {
        if (!courseId || !departmentId) {
            alert("Missing course or department context");
            return;
        }
        setCreateModalOpened(true);
    };

    const handleCreateSubmit = async (data: { 
        activityType: string; 
        assignedUserId: string; 
        expectedStudents: number | null;
    }) => {
        console.log("🟢 [GroupsPage] handleCreateSubmit called with:", data);
        
        if (!courseId || !departmentId) {
            console.error("❌ Missing courseId or departmentId");
            alert("Missing course or department context");
            return;
        }

        const org = $app.organization.getOrganization();
        console.log("🟢 [GroupsPage] Organization from context:", org);

        const request: CreateActivityRequest = {
            id: crypto.randomUUID(),
            organizationId: org?.id || "00000000-0000-0000-0000-000000000000",
            subjectId: courseId,
            assignedUserId: data.assignedUserId || "00000000-0000-0000-0000-000000000000",
            activityType: data.activityType,
            expectedStudents: data.expectedStudents,
        };

        console.log("🟢 [GroupsPage] Sending create request:", request);

        try {
            const result = await createActivity(courseId, request);
            console.log("✅ [GroupsPage] Create activity result:", result);
            
            if (result) {
                setCreateModalOpened(false);
                fetchActivities(); // Refresh the list
            } else {
                console.error("❌ Create activity returned null");
                setCreateModalOpened(false);
                alert("Failed to create activity. Please check the console for details.");
            }
        } catch (error) {
            console.error("❌ Error creating activity:", error);
            setCreateModalOpened(false);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            alert(`Error creating activity: ${errorMessage}`);
        }
    };

    const handleEditClick = () => {
        if (selectedGroup) {
            setEditModalOpened(true);
        }
    };

    const handleEditSubmit = async (data: {
        activityType: string;
        assignedUserId: string;
        expectedStudents: number | null;
    }) => {
        console.log("🟣 [GroupsPage] handleEditSubmit called with:", data);
        console.log("🟣 [GroupsPage] selectedGroup:", selectedGroup);
        
        if (!selectedGroup || !courseId || !departmentId) {
            console.error("❌ Missing selectedGroup, courseId, or departmentId");
            alert("Missing required context for edit");
            return;
        }

        const org = $app.organization.getOrganization();
        console.log("🟣 [GroupsPage] Organization from context:", org);

        const request: UpdateActivityRequest = {
            organizationId: org?.id || "00000000-0000-0000-0000-000000000000",
            subjectId: courseId,
            assignedUserId: data.assignedUserId || "00000000-0000-0000-0000-000000000000",
            activityType: data.activityType,
            expectedStudents: data.expectedStudents,
        };

        console.log("🟣 [GroupsPage] Sending update request:", request);

        try {
            const success = await updateActivity(selectedGroup.id, request);
            console.log("✅ [GroupsPage] Update activity result:", success);
            
            if (success) {
                setEditModalOpened(false);
                setSelectedGroup(null);
                fetchActivities(); // Refresh the list
            } else {
                console.error("❌ Update activity returned false");
                setEditModalOpened(false);
                alert("Failed to update activity. Please check the console for details.");
            }
        } catch (error) {
            console.error("❌ Error updating activity:", error);
            setEditModalOpened(false);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            alert(`Error updating activity: ${errorMessage}`);
        }
    };

    const handleDeleteClick = () => {
        if (!selectedGroup) {
            return;
        }

        openConfirmation({
            title: resources.deleteConfirmTitle,
            message: resources.deleteConfirmMessage,
            onConfirm: async () => {
                console.log("🗑️ [GroupsPage] Deleting activity:", selectedGroup.id);
                const success = await deleteActivity(selectedGroup.id);
                if (success) {
                    setSelectedGroup(null);
                }
            },
        });
    };

    // Filter activities for the current course
    const courseActivities: GroupData[] = activities
        .filter((activity) => activity.subjectId === courseId)
        .map((activity) => ({
            id: activity.id,
            activityType: activity.activityType,
            assignedUserId: activity.assignedUserId,
            expectedStudents: activity.expectedStudents || 0,
        }));

    console.log("🔷 [GroupsPage] Filtered course activities:", courseActivities.length);

    if (!courseId) {
        return (
            <Container size="xl" py="xl">
                <Title order={1}>No course selected</Title>
                <Button onClick={handleBackClick} mt="md">
                    {resources.backToCourses}
                </Button>
            </Container>
        );
    }

    if (!departmentId) {
        return (
            <Container size="xl" py="xl">
                <Title order={1}>Missing Department Context</Title>
                <Text>Department ID is required to load groups.</Text>
                <Button onClick={handleBackClick} mt="md">
                    {resources.backToCourses}
                </Button>
            </Container>
        );
    }

    return (
        <Container size="xl" py="xl">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <Title order={1}>{resources.title}</Title>
                        {courseName && (
                            <Text size="lg" c="dimmed">
                                {decodeURIComponent(courseName)}
                            </Text>
                        )}
                    </div>
                    <Button variant="outline" onClick={handleBackClick}>
                        {resources.backToCourses}
                    </Button>
                </div>
                <Divider className={styles.divider} />

                <Alert color="yellow" title="Backend Connected" mb="md">
                    Using backend API for groups (activities) management.
                </Alert>

                <Group justify="space-between" mb="md">
                    <GroupActions
                        selectedGroup={selectedGroup}
                        onCreateClick={handleCreateClick}
                        onEditClick={handleEditClick}
                        onDeleteClick={handleDeleteClick}
                    />
                    <Button variant="default" onClick={handleBackClick}>
                        Back to Courses
                    </Button>
                </Group>

                <GroupTable
                    groups={courseActivities}
                    selectedGroup={selectedGroup}
                    onSelectionChange={setSelectedGroup}
                    loading={isLoading}
                />

                <GroupCreator
                    opened={createModalOpened}
                    onClose={() => setCreateModalOpened(false)}
                    onSubmit={handleCreateSubmit}
                    loading={isCreating}
                />

                <GroupEditor
                    opened={editModalOpened}
                    onClose={() => setEditModalOpened(false)}
                    onSubmit={handleEditSubmit}
                    loading={isEditing}
                    initialData={
                        selectedGroup
                            ? {
                                  activityType: selectedGroup.activityType,
                                  assignedUserId: selectedGroup.assignedUserId,
                                  expectedStudents: selectedGroup.expectedStudents,
                              }
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
                    loading={isConfirming}
                />
            </div>
        </Container>
    );
}
