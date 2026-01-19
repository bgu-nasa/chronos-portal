import { useState, useEffect } from "react";
import { Container, Divider, Title } from "@mantine/core";
import { ConfirmationDialog, useConfirmation } from "@/common";
import { ResourceTypeActions, ResourceTypeTable, ResourceTypeCreator, ResourceTypeEditor, type ResourceTypeData } from "./components";
import type { UpdateResourceTypeRequest } from "@/modules/resources/src/data";
import { useResourceTypes, useCreateResourceType, useUpdateResourceType, useDeleteResourceType } from "@/modules/resources/src/hooks";
import resources from "./resource-types-page.resources.json";
import styles from "./resource-types-page.module.css";
import { $app } from "@/infra/service";
import { showSuccessNotification, showErrorNotification, showWarningNotification } from "../../utils/notification-functions";
import { ResourceNotifications } from "../../utils/notifications";

export function ResourceTypesPage() {
    const [selectedResourceType, setSelectedResourceType] = useState<ResourceTypeData | null>(null);
    const [createModalOpened, setCreateModalOpened] = useState(false);
    const [editModalOpened, setEditModalOpened] = useState(false);

    const { resourceTypes, fetchResourceTypes } = useResourceTypes();
    const { createResourceType, isLoading: isCreating } = useCreateResourceType();
    const { updateResourceType, isLoading: isEditing } = useUpdateResourceType();
    const { deleteResourceType } = useDeleteResourceType();

    const {
        confirmationState,
        openConfirmation,
        closeConfirmation,
        handleConfirm,
        isLoading: isDeleting,
    } = useConfirmation();

    // Fetch data on mount
    useEffect(() => {
        fetchResourceTypes();
    }, [fetchResourceTypes]);

    const handleCreateClick = () => {
        $app.logger.info("[ResourceTypesPage] handleCreateClick called");
        setCreateModalOpened(true);
    };

    const handleCreateSubmit = async (data: { type: string }) => {
        $app.logger.info("[ResourceTypesPage] handleCreateSubmit called with:", data);

        const org = $app.organization.getOrganization();
        $app.logger.info("[ResourceTypesPage] Organization from context:", org);

        const request = {
            organizationId: org?.id || "00000000-0000-0000-0000-000000000000",
            type: data.type,
        };

        $app.logger.info("[ResourceTypesPage] Sending create request:", request);

        try {
            const result = await createResourceType(request);
            $app.logger.info("[ResourceTypesPage] Create resource type result:", result);

            if (result) {
                setCreateModalOpened(false);
                showSuccessNotification({ message: "Resource type created successfully" });
            } else {
                $app.logger.error("[ResourceTypesPage] Create resource type returned null");
                showErrorNotification({ message: "Failed to create resource type. Check console for details." });
            }
        } catch (error) {
            $app.logger.error("[ResourceTypesPage] Error creating resource type:", error);
            showErrorNotification({ 
                message: `Error creating resource type: ${error instanceof Error ? error.message : "Unknown error"}` 
            });
        }
    };

    const handleEditClick = () => {
        $app.logger.info("[ResourceTypesPage] handleEditClick called");
        if (selectedResourceType) {
            setEditModalOpened(true);
        }
    };

    const handleEditSubmit = async (data: { type: string }) => {
        $app.logger.info("[ResourceTypesPage] handleEditSubmit called with:", data);

        if (!selectedResourceType) {
            $app.logger.error("[ResourceTypesPage] Missing selectedResourceType");
            showWarningNotification({ message: "Missing resource type context for edit." });
            return;
        }

        const request: UpdateResourceTypeRequest = {
            type: data.type,
        };

        $app.logger.info("[ResourceTypesPage] Sending update request:", request);

        try {
            const success = await updateResourceType(selectedResourceType.id, request);
            $app.logger.info("[ResourceTypesPage] Update resource type result:", success);

            if (success) {
                setEditModalOpened(false);
                setSelectedResourceType(null);
                showSuccessNotification({ message: "Resource type updated successfully" });
            } else {
                $app.logger.error("[ResourceTypesPage] Update resource type returned false");
                showErrorNotification({ message: "Failed to update resource type. Check console for details." });
            }
        } catch (error) {
            $app.logger.error("[ResourceTypesPage] Error updating resource type:", error);
            showErrorNotification({ 
                message: `Error updating resource type: ${error instanceof Error ? error.message : "Unknown error"}` 
            });
        }
    };

    const handleDeleteClick = () => {
        $app.logger.info("[ResourceTypesPage] handleDeleteClick called");
        if (!selectedResourceType) return;

        openConfirmation({
            title: resources.deleteConfirmTitle,
            message: resources.deleteConfirmMessage.replace(
                "{type}",
                selectedResourceType.type
            ),
            onConfirm: async () => {
                const success = await deleteResourceType(selectedResourceType.id);
                if (success) {
                    setSelectedResourceType(null);
                }
            },
        });
    };

    const resourceTypeData: ResourceTypeData[] = resourceTypes.map((resourceType) => ({
        id: resourceType.id,
        type: resourceType.type,
        organizationName: "Organization",
    }));

    return (
        <Container size="xl" py="xl">
            <ResourceNotifications />
            <div className={styles.container}>
                <Title order={1}>{resources.title}</Title>
                <Divider className={styles.divider} />

                <ResourceTypeActions
                    selectedResourceType={selectedResourceType}
                    onCreateClick={handleCreateClick}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                />

                <ResourceTypeTable
                    resourceTypes={resourceTypeData}
                    selectedResourceType={selectedResourceType}
                    onSelectionChange={setSelectedResourceType}
                />

                <ResourceTypeCreator
                    opened={createModalOpened}
                    onClose={() => setCreateModalOpened(false)}
                    onSubmit={handleCreateSubmit}
                    loading={isCreating}
                />

                <ResourceTypeEditor
                    opened={editModalOpened}
                    onClose={() => setEditModalOpened(false)}
                    onSubmit={handleEditSubmit}
                    loading={isEditing}
                    initialData={
                        selectedResourceType
                            ? { type: selectedResourceType.type }
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
