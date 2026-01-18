import { useState, useEffect } from "react";
import { Container, Divider, Title } from "@mantine/core";
import { ConfirmationDialog, useConfirmation } from "@/common";
import { ResourceActions } from "./components/resource-actions";
import { ResourceTable } from "./components/resource-table/resource-table";
import { ResourceCreator } from "./components/resource-creator";
import { ResourceEditor } from "./components/resource-editor";
import type { ResourceData } from "./components/resource-table/types";
import type { UpdateResourceRequest } from "@/modules/resources/src/data";
import {
    useResources,
    useCreateResource,
    useUpdateResource,
    useDeleteResource,
    useResourceTypes,
} from "@/modules/resources/src/hooks";
import resources from "./resources-page.resources.json";
import styles from "./resources-page.module.css";
import { $app } from "@/infra/service";

export function ResourcesPage() {
    const [selectedResource, setSelectedResource] = useState<ResourceData | null>(null);
    const [createModalOpened, setCreateModalOpened] = useState(false);
    const [editModalOpened, setEditModalOpened] = useState(false);

    const { resources: resourcesList, fetchResources } = useResources();
    const { createResource, isLoading: isCreating } = useCreateResource();
    const { updateResource, isLoading: isEditing } = useUpdateResource();
    const { deleteResource } = useDeleteResource();
    const { resourceTypes, fetchResourceTypes } = useResourceTypes();

    const {
        confirmationState,
        openConfirmation,
        closeConfirmation,
        handleConfirm,
        isLoading: isDeleting,
    } = useConfirmation();

    // Fetch data on mount
    useEffect(() => {
        fetchResources();
        fetchResourceTypes();
    }, [fetchResources, fetchResourceTypes]);

    const handleCreateClick = () => {
        $app.logger.info("[ResourcesPage] handleCreateClick called");
        setCreateModalOpened(true);
    };

    const handleCreateSubmit = async (data: {
        resourceTypeId: string;
        location: string;
        identifier: string;
        capacity: number | null;
    }) => {
        $app.logger.info("[ResourcesPage] handleCreateSubmit called with:", data);

        const org = $app.organization.getOrganization();
        $app.logger.info("[ResourcesPage] Organization from context:", org);

        const request = {
            id: crypto.randomUUID(),
            organizationId: org?.id || "00000000-0000-0000-0000-000000000000",
            resourceTypeId: data.resourceTypeId,
            location: data.location,
            identifier: data.identifier,
            capacity: data.capacity,
        };

        $app.logger.info("[ResourcesPage] Sending create request:", request);

        try {
            const result = await createResource(request);
            $app.logger.info("[ResourcesPage] Create resource result:", result);

            if (result) {
                setCreateModalOpened(false);
            } else {
                $app.logger.error("[ResourcesPage] Create resource returned null");
                alert("Failed to create resource. Check console for details.");
            }
        } catch (error) {
            $app.logger.error("[ResourcesPage] Error creating resource:", error);
            alert(`Error creating resource: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    };

    const handleEditClick = () => {
        $app.logger.info("[ResourcesPage] handleEditClick called");
        if (selectedResource) {
            setEditModalOpened(true);
        }
    };

    const handleEditSubmit = async (data: {
        resourceTypeId: string;
        location: string;
        identifier: string;
        capacity: number | null;
    }) => {
        $app.logger.info("[ResourcesPage] handleEditSubmit called with:", data);

        if (!selectedResource) {
            $app.logger.error("[ResourcesPage] Missing selectedResource");
            alert("Missing resource context for edit.");
            return;
        }

        const request: UpdateResourceRequest = {
            resourceTypeId: data.resourceTypeId,
            location: data.location,
            identifier: data.identifier,
            capacity: data.capacity,
        };

        $app.logger.info("[ResourcesPage] Sending update request:", request);

        try {
            const success = await updateResource(selectedResource.id, request);
            $app.logger.info("[ResourcesPage] Update resource result:", success);

            if (success) {
                setEditModalOpened(false);
                setSelectedResource(null);
            } else {
                $app.logger.error("[ResourcesPage] Update resource returned false");
                alert("Failed to update resource. Check console for details.");
            }
        } catch (error) {
            $app.logger.error("[ResourcesPage] Error updating resource:", error);
            alert(`Error updating resource: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    };

    const handleDeleteClick = () => {
        $app.logger.info("[ResourcesPage] handleDeleteClick called");
        if (!selectedResource) return;

        openConfirmation({
            title: resources.deleteConfirmTitle,
            message: resources.deleteConfirmMessage.replace(
                "{identifier}",
                selectedResource.identifier
            ),
            onConfirm: async () => {
                const success = await deleteResource(selectedResource.id);
                if (success) {
                    setSelectedResource(null);
                }
            },
        });
    };

    const resourceData: ResourceData[] = resourcesList.map((resource) => {
        const resourceType = resourceTypes.find((rt) => rt.id === resource.resourceTypeId);
        return {
            id: resource.id,
            resourceTypeId: resource.resourceTypeId,
            location: resource.location,
            identifier: resource.identifier,
            capacity: resource.capacity,
            organizationName: "Organization",
            resourceTypeName: resourceType?.type || "Unknown",
        };
    });

    return (
        <Container size="xl" py="xl">
            <div className={styles.container}>
                <Title order={1}>{resources.title}</Title>
                <Divider className={styles.divider} />

                <ResourceActions
                    selectedResource={selectedResource}
                    onCreateClick={handleCreateClick}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                />

                <ResourceTable
                    resources={resourceData}
                    selectedResource={selectedResource}
                    onSelectionChange={setSelectedResource}
                />

                <ResourceCreator
                    opened={createModalOpened}
                    onClose={() => setCreateModalOpened(false)}
                    onSubmit={handleCreateSubmit}
                    loading={isCreating}
                />

                <ResourceEditor
                    opened={editModalOpened}
                    onClose={() => setEditModalOpened(false)}
                    onSubmit={handleEditSubmit}
                    loading={isEditing}
                    initialData={
                        selectedResource
                            ? {
                                  resourceTypeId: selectedResource.resourceTypeId,
                                  location: selectedResource.location,
                                  identifier: selectedResource.identifier,
                                  capacity: selectedResource.capacity,
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
                    loading={isDeleting}
                />
            </div>
        </Container>
    );
}
