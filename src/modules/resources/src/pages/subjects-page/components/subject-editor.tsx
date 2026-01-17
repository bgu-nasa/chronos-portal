import { Modal, TextInput, Button, Stack } from "@mantine/core";
import { useState, useEffect } from "react";
import { $app } from "@/infra/service";

interface SubjectEditorProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: { code: string; name: string }) => Promise<void>;
    loading?: boolean;
    initialData?: { code: string; name: string };
}

export function SubjectEditor({
    opened,
    onClose,
    onSubmit,
    loading = false,
    initialData,
}: SubjectEditorProps) {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        if (initialData) {
            setCode(initialData.code);
            setName(initialData.name);
        }
    }, [initialData]);

    const handleSubmit = async () => {
        $app.logger.info("[SubjectEditor] handleSubmit called", { code, name });
        
        if (!code.trim() || !name.trim()) {
            $app.logger.warn("[SubjectEditor] Validation failed - empty fields");
            return;
        }
        
        $app.logger.info("[SubjectEditor] Calling onSubmit...");
        await onSubmit({ code, name });
        
        $app.logger.info("[SubjectEditor] onSubmit completed, resetting form");
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
            title="Edit Course"
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
                    Save Changes
                </Button>
            </Stack>
        </Modal>
    );
}
