import { useEffect, useState } from "react";
import { Container, Divider, Title, Select, Paper, Text } from "@mantine/core";
import { ConfirmationDialog, useConfirmation } from "@/common";
import { SlotActions } from "./components/slot-actions";
import { SlotTable } from "./components/slot-table";
import { SlotEditor } from "./components/slot-editor";
import { useSlots, useDeleteSlot } from "@/modules/schedule/src/hooks/use-slots";
import { useSlotEditorStore } from "@/modules/schedule/src/stores/slot-editor.store";
import { useCurrentSchedulingPeriods } from "@/modules/schedule/src/hooks/use-scheduling-periods";
import type { SlotResponse } from "@/modules/schedule/src/data/slot.types";
import resources from "./slots-page.resources.json";

export function SlotsPage() {
    const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<SlotResponse | null>(null);

    // Hooks
    const { currentSchedulingPeriods, fetchCurrentSchedulingPeriods } = useCurrentSchedulingPeriods();
    const { slots, fetchSlots, clearSlots } = useSlots();
    const { deleteSlot } = useDeleteSlot();
    const { openCreate, openEdit } = useSlotEditorStore();

    // Confirmation Dialog
    const {
        confirmationState,
        openConfirmation,
        closeConfirmation,
        handleConfirm,
        isLoading: isConfirming,
    } = useConfirmation();

    // Fetch current periods on mount
    useEffect(() => {
        fetchCurrentSchedulingPeriods();
    }, []);

    // Fetch slots when period changes
    useEffect(() => {
        if (selectedPeriodId) {
            fetchSlots(selectedPeriodId);
        } else {
            clearSlots();
        }
        setSelectedSlot(null);
    }, [selectedPeriodId]);

    const periodOptions = currentSchedulingPeriods.map((period) => ({
        value: period.id,
        label: period.name,
    }));

    const handleCreateClick = () => {
        openCreate();
    };

    const handleEditClick = () => {
        if (selectedSlot) {
            openEdit(selectedSlot);
        }
    };

    const handleDeleteClick = () => {
        if (!selectedSlot || !selectedPeriodId) return;

        openConfirmation({
            title: resources.deleteConfirmTitle,
            message: resources.deleteConfirmMessage,
            onConfirm: async () => {
                const success = await deleteSlot(selectedSlot.id);
                if (success) {
                    setSelectedSlot(null);
                }
            },
        });
    };

    return (
        <Container size="xl" py="xl">
            <Title order={1}>{resources.title}</Title>
            <Divider my="md" />

            {currentSchedulingPeriods.length === 0 ? (
                <Paper p="xl" withBorder>
                    <Text c="dimmed" ta="center">{resources.noPeriodsAvailable}</Text>
                </Paper>
            ) : (
                <>
                    <Select
                        label={resources.selectPeriodLabel}
                        placeholder={resources.selectPeriodPlaceholder}
                        data={periodOptions}
                        value={selectedPeriodId}
                        onChange={setSelectedPeriodId}
                        mb="xl"
                        searchable
                        allowDeselect={false}
                    />

                    {selectedPeriodId ? (
                        <>
                            <SlotActions
                                selectedSlot={selectedSlot}
                                onCreateClick={handleCreateClick}
                                onEditClick={handleEditClick}
                                onDeleteClick={handleDeleteClick}
                            />

                            <SlotTable
                                slots={slots}
                                selectedSlot={selectedSlot}
                                onSelectionChange={setSelectedSlot}
                            />

                            <SlotEditor schedulingPeriodId={selectedPeriodId} />
                        </>
                    ) : (
                        <Paper p="xl" withBorder>
                            <Text c="dimmed" ta="center">{resources.noPeriodSelectedValues}</Text>
                        </Paper>
                    )}
                </>
            )}

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
        </Container>
    );
}
