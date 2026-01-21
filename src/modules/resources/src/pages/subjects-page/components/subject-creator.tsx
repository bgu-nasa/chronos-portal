import { Modal, TextInput, Button, Stack, Select } from "@mantine/core";
import { useState, useEffect } from "react";
import { schedulingPeriodRepository } from "@/modules/resources/src/data";

interface SubjectCreatorProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: { code: string; name: string; schedulingPeriodId: string }) => Promise<void>;
    loading?: boolean;
}

export function SubjectCreator({
    opened,
    onClose,
    onSubmit,
    loading = false,
}: SubjectCreatorProps) {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [schedulingPeriodId, setSchedulingPeriodId] = useState<string | null>(null);
    const [schedulingPeriods, setSchedulingPeriods] = useState<{ value: string; label: string }[]>([]);
    const [isLoadingPeriods, setIsLoadingPeriods] = useState(false);

    // Fetch scheduling periods when modal opens
    useEffect(() => {
        if (opened) {
            fetchSchedulingPeriods();
        }
    }, [opened]);

    const fetchSchedulingPeriods = async () => {
        setIsLoadingPeriods(true);
        try {
            const periods = await schedulingPeriodRepository.getAll();
            const options = periods.map((period) => ({
                value: period.id,
                label: period.name,
            }));
            setSchedulingPeriods(options);
            $app.logger.info("[SubjectCreator] Fetched scheduling periods", { count: options.length });
        } catch (error) {
            $app.logger.error("[SubjectCreator] Error fetching scheduling periods:", error);
            $app.notifications.showError("Error", "Failed to load scheduling periods");
        } finally {
            setIsLoadingPeriods(false);
        }
    };

    const handleSubmit = async () => {
        $app.logger.info("[SubjectCreator] handleSubmit called", { code, name, schedulingPeriodId });
        
        if (!code.trim() || !name.trim() || !schedulingPeriodId) {
            $app.logger.warn("[SubjectCreator] Validation failed - empty fields");
            return;
        }
        
        $app.logger.info("[SubjectCreator] Calling onSubmit...");
        await onSubmit({ code, name, schedulingPeriodId });
        
        $app.logger.info("[SubjectCreator] onSubmit completed, resetting form");
        setCode("");
        setName("");
        setSchedulingPeriodId(null);
    };

    const handleClose = () => {
        setCode("");
        setName("");
        setSchedulingPeriodId(null);
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title="Create Course"
            centered
        >
            <Stack>
                <TextInput
                    label="Course Code"
                    placeholder="e.g. CS101"
                    value={code}
                    onChange={(e) => setCode(e.currentTarget.value)}
                    required
                />
                <TextInput
                    label="Course Name"
                    placeholder="e.g. Operating Systems"
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                    required
                />
                <Select
                    label="Scheduling Period"
                    placeholder="Select scheduling period"
                    data={schedulingPeriods}
                    value={schedulingPeriodId}
                    onChange={setSchedulingPeriodId}
                    disabled={isLoadingPeriods}
                    searchable
                    required
                />
                <Button
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={!code.trim() || !name.trim() || !schedulingPeriodId || isLoadingPeriods}
                    fullWidth
                >
                    Create Course
                </Button>
            </Stack>
        </Modal>
    );
}
