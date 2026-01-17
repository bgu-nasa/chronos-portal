import { useEffect, useState } from "react";
import { Container, Divider, Title } from "@mantine/core";
import { ConfirmationDialog, useConfirmation } from "@/common";
import { SchedulingPeriodActions } from "@/modules/schedule/src/pages/scheduling-periods-page/components/scheduling-period-actions";
import { SchedulingPeriodTable } from "@/modules/schedule/src/pages/scheduling-periods-page/components/scheduling-period-table";
import { SchedulingPeriodEditor } from "@/modules/schedule/src/pages/scheduling-periods-page/components/scheduling-period-editor";
import type { SchedulingPeriodData } from "@/modules/schedule/src/stores/scheduling-period-editor.store";
import { useSchedulingPeriodEditorStore } from "@/modules/schedule/src/stores/scheduling-period-editor.store";
import {
    useSchedulingPeriods,
    useDeleteSchedulingPeriod,
} from "@/modules/schedule/src/hooks/use-scheduling-periods";
import resources from "@/modules/schedule/src/pages/scheduling-periods-page/scheduling-periods-page.resources.json";
import styles from "@/modules/schedule/src/pages/scheduling-periods-page/scheduling-periods-page.module.css";

export function SchedulingPeriodsPage() {
    const [selectedPeriod, setSelectedPeriod] =
        useState<SchedulingPeriodData | null>(null);
    const { schedulingPeriods, fetchSchedulingPeriods } = useSchedulingPeriods();
    const { deleteSchedulingPeriod } = useDeleteSchedulingPeriod();
    const { openCreate, openEdit } = useSchedulingPeriodEditorStore();
    const {
        confirmationState,
        openConfirmation,
        closeConfirmation,
        handleConfirm,
        isLoading: isConfirming,
    } = useConfirmation();

    // Fetch scheduling periods on mount
    useEffect(() => {
        fetchSchedulingPeriods();
    }, []);

    const handleCreateClick = () => {
        openCreate();
    };

    const handleEditClick = () => {
        if (selectedPeriod) {
            openEdit(selectedPeriod);
        }
    };

    const handleDeleteClick = () => {
        if (!selectedPeriod) {
            return;
        }

        openConfirmation({
            title: resources.deleteConfirmTitle,
            message: resources.deleteConfirmMessage.replace(
                "{name}",
                selectedPeriod.name
            ),
            onConfirm: async () => {
                const success = await deleteSchedulingPeriod(selectedPeriod.id);
                if (success) {
                    // State automatically updated by store, just clear selection
                    setSelectedPeriod(null);
                }
            },
        });
    };

    // Convert SchedulingPeriodResponse to SchedulingPeriodData
    const periodData: SchedulingPeriodData[] = schedulingPeriods.map((period) => ({
        id: period.id,
        name: period.name,
        fromDate: period.fromDate,
        toDate: period.toDate,
    }));

    return (
        <Container size="xl" py="xl">
            <div className={styles.container}>
                <Title order={1}>{resources.title}</Title>
                <Divider className={styles.divider} />

                <SchedulingPeriodActions
                    selectedPeriod={selectedPeriod}
                    onCreateClick={handleCreateClick}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                />

                <SchedulingPeriodTable
                    schedulingPeriods={periodData}
                    selectedPeriod={selectedPeriod}
                    onSelectionChange={setSelectedPeriod}
                />

                <SchedulingPeriodEditor />

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
