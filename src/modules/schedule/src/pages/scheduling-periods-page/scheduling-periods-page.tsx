import { useEffect, useState, useMemo } from "react";
import { Container, Divider, Title, Grid, Paper, Text, Button } from "@mantine/core";
import { ConfirmationDialog, useConfirmation } from "@/common";
import { SchedulingPeriodActions } from "@/modules/schedule/src/pages/scheduling-periods-page/components/scheduling-period-actions";
import { SchedulingPeriodTable } from "@/modules/schedule/src/pages/scheduling-periods-page/components/scheduling-period-table";
import { SchedulingPeriodEditor } from "@/modules/schedule/src/pages/scheduling-periods-page/components/scheduling-period-editor";
import { SlotTable } from "@/modules/schedule/src/pages/slots-page/components/slot-table";
import { SlotActions } from "@/modules/schedule/src/pages/slots-page/components/slot-actions";
import { SlotEditor } from "@/modules/schedule/src/pages/slots-page/components/slot-editor";
import type { SchedulingPeriodData } from "@/modules/schedule/src/stores/scheduling-period-editor.store";
import { useSchedulingPeriodEditorStore } from "@/modules/schedule/src/stores/scheduling-period-editor.store";
import { useSlotEditorStore } from "@/modules/schedule/src/stores/slot-editor.store";
import {
    useSchedulingPeriods,
    useDeleteSchedulingPeriod,
} from "@/modules/schedule/src/hooks/use-scheduling-periods";
import { useSlots, useDeleteSlot } from "@/modules/schedule/src/hooks/use-slots";
import type { SlotResponse } from "@/modules/schedule/src/data/slot.types";
import resources from "@/modules/schedule/src/pages/scheduling-periods-page/scheduling-periods-page.resources.json";
import styles from "@/modules/schedule/src/pages/scheduling-periods-page/scheduling-periods-page.module.css";

export interface SchedulingPeriodDataWithExpired extends SchedulingPeriodData {
    isExpired: boolean;
}

export function SchedulingPeriodsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<SchedulingPeriodDataWithExpired | null>(null);
    const [showSlots, setShowSlots] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<SlotResponse | null>(null);

    const { schedulingPeriods, fetchSchedulingPeriods } = useSchedulingPeriods();
    const { deleteSchedulingPeriod } = useDeleteSchedulingPeriod();
    const { openCreate, openEdit } = useSchedulingPeriodEditorStore();
    const { openCreate: openCreateSlot, openEdit: openEditSlot } = useSlotEditorStore();
    const { slots, fetchSlots } = useSlots();
    const { deleteSlot } = useDeleteSlot();

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

    // Process periods: add isExpired flag, sort by fromDate
    const processedPeriods = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return schedulingPeriods
            .map((period) => {
                const fromDate = new Date(period.fromDate);
                fromDate.setHours(0, 0, 0, 0);
                const isExpired = fromDate <= today;

                return {
                    id: period.id,
                    name: period.name,
                    fromDate: period.fromDate,
                    toDate: period.toDate,
                    isExpired,
                };
            })
            .sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime());
    }, [schedulingPeriods]);

    // Auto-select the closest upcoming period on initial load
    useEffect(() => {
        if (processedPeriods.length > 0 && !selectedPeriod) {
            const closestUpcoming = processedPeriods.find((p) => !p.isExpired);
            if (closestUpcoming) {
                setSelectedPeriod(closestUpcoming);
            } else {
                setSelectedPeriod(processedPeriods[processedPeriods.length - 1]);
            }
        }
    }, [processedPeriods]);

    // Fetch slots when showing slots panel
    useEffect(() => {
        if (showSlots && selectedPeriod) {
            fetchSlots(selectedPeriod.id);
        }
    }, [showSlots, selectedPeriod]);

    const handleCreateClick = () => openCreate();

    const handleEditClick = () => {
        if (selectedPeriod && !selectedPeriod.isExpired) {
            openEdit(selectedPeriod);
        }
    };

    const handleDeleteClick = () => {
        if (!selectedPeriod || selectedPeriod.isExpired) return;

        openConfirmation({
            title: resources.deleteConfirmTitle,
            message: resources.deleteConfirmMessage.replace("{name}", selectedPeriod.name),
            onConfirm: async () => {
                const success = await deleteSchedulingPeriod(selectedPeriod.id);
                if (success) {
                    setSelectedPeriod(null);
                    setShowSlots(false);
                }
            },
        });
    };

    const handleViewSlotsClick = () => {
        if (selectedPeriod) {
            setShowSlots(true);
            setSelectedSlot(null);
        }
    };

    // Slot actions
    const handleCreateSlotClick = () => openCreateSlot();

    const handleEditSlotClick = () => {
        if (selectedSlot) openEditSlot(selectedSlot);
    };

    const handleDeleteSlotClick = () => {
        if (!selectedSlot) return;

        openConfirmation({
            title: "Delete Slot",
            message: "Are you sure you want to delete this slot?",
            onConfirm: async () => {
                const success = await deleteSlot(selectedSlot.id);
                if (success) setSelectedSlot(null);
            },
        });
    };

    return (
        <Container size="xl" py="xl">
            <div className={styles.container}>
                <Title order={1}>{resources.title}</Title>
                <Divider className={styles.divider} />

                <Grid gutter="xl">
                    {/* Left side: Periods */}
                    <Grid.Col span={showSlots ? 4 : 12}>
                        <SchedulingPeriodActions
                            selectedPeriod={selectedPeriod}
                            isExpired={selectedPeriod?.isExpired ?? false}
                            onCreateClick={handleCreateClick}
                            onEditClick={handleEditClick}
                            onDeleteClick={handleDeleteClick}
                            onViewSlotsClick={handleViewSlotsClick}
                        />

                        <SchedulingPeriodTable
                            schedulingPeriods={processedPeriods}
                            selectedPeriod={selectedPeriod}
                            onSelectionChange={(period) => {
                                setSelectedPeriod(period);
                                if (period && showSlots) {
                                    fetchSlots(period.id);
                                    setSelectedSlot(null);
                                }
                            }}
                        />
                    </Grid.Col>

                    {/* Right side: Slots (when visible) */}
                    {showSlots && selectedPeriod && (
                        <Grid.Col span={8}>
                            <Paper p="md" withBorder>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                    <Title order={3}>
                                        Slots - {selectedPeriod.name}
                                    </Title>
                                    <Button
                                        variant="subtle"
                                        size="sm"
                                        onClick={() => setShowSlots(false)}
                                        style={{ padding: "4px 8px" }}
                                    >
                                        ✕
                                    </Button>
                                </div>

                                {selectedPeriod.isExpired ? (
                                    <Text c="dimmed" ta="center" py="xl">
                                        This period has expired. Slots cannot be edited.
                                    </Text>
                                ) : (
                                    <SlotActions
                                        selectedSlot={selectedSlot}
                                        onCreateClick={handleCreateSlotClick}
                                        onEditClick={handleEditSlotClick}
                                        onDeleteClick={handleDeleteSlotClick}
                                    />
                                )}

                                <SlotTable
                                    slots={slots}
                                    selectedSlot={selectedSlot}
                                    onSelectionChange={setSelectedSlot}
                                />

                                {!selectedPeriod.isExpired && (
                                    <SlotEditor schedulingPeriodId={selectedPeriod.id} />
                                )}
                            </Paper>
                        </Grid.Col>
                    )}
                </Grid>

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
