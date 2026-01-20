import { Modal, TextInput, Button, Stack } from "@mantine/core";
import { useState } from "react";
import { $app } from "@/infra/service";
import resources from "../resource-types-page.resources.json";

interface ResourceTypeCreatorProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: { type: string }) => Promise<void>;
    loading?: boolean;
}

export function ResourceTypeCreator({
    opened,
    onClose,
    onSubmit,
    loading = false,
}: ResourceTypeCreatorProps) {
    const [type, setType] = useState("");

    const handleSubmit = async () => {
        $app.logger.info("[ResourceTypeCreator] handleSubmit called", { type });
        if (!type.trim()) {
            $app.logger.warn("[ResourceTypeCreator] Validation failed - empty fields");
            return;
        }
        $app.logger.info("[ResourceTypeCreator] Calling onSubmit...");
        await onSubmit({ type });
        $app.logger.info("[ResourceTypeCreator] onSubmit completed, resetting form");
        setType("");
    };

    const handleClose = () => {
        setType("");
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={resources.editorCreateTitle}
            centered
        >
            <Stack>
                <TextInput
                    label={resources.editorTypeLabel}
                    placeholder={resources.editorTypePlaceholder}
                    value={type}
                    onChange={(e) => setType(e.currentTarget.value)}
                    required
                />
                <Button
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={!type.trim()}
                    fullWidth
                >
                    {resources.editorCreateButton}
                </Button>
            </Stack>
        </Modal>
    );
}
