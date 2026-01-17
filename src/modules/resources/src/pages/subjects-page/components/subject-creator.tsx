import { Modal, TextInput, Button, Stack } from "@mantine/core";
import { useState } from "react";
import { $app } from "@/infra/service";

interface SubjectCreatorProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: { code: string; name: string }) => Promise<void>;
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

    const handleSubmit = async () => {
        $app.logger.info("[SubjectCreator] handleSubmit called", { code, name });
        
        if (!code.trim() || !name.trim()) {
            $app.logger.warn("[SubjectCreator] Validation failed - empty fields");
            return;
        }
        
        $app.logger.info("[SubjectCreator] Calling onSubmit...");
        await onSubmit({ code, name });
        
        $app.logger.info("[SubjectCreator] onSubmit completed, resetting form");
        setCode("");
        setName("");
    };

    const handleClose = () => {
        setCode("");
        setName("");
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
                <Button
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={!code.trim() || !name.trim()}
                    fullWidth
                >
                    Create Course
                </Button>
            </Stack>
        </Modal>
    );
}
