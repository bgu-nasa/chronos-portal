import { Modal, TextInput, Button, Stack } from "@mantine/core";
import { useState, useEffect } from "react";

interface CourseEditorProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: { code: string; name: string }) => Promise<void>;
    loading?: boolean;
    initialData?: { code: string; name: string };
}

export function CourseEditor({
    opened,
    onClose,
    onSubmit,
    loading = false,
    initialData,
}: CourseEditorProps) {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        if (initialData) {
            setCode(initialData.code);
            setName(initialData.name);
        }
    }, [initialData]);

    const handleSubmit = async () => {
        console.log("🟠 [CourseEditor] handleSubmit called", { code, name });
        
        if (!code.trim() || !name.trim()) {
            console.warn("🟠 [CourseEditor] Validation failed - empty fields");
            return;
        }
        
        console.log("🟠 [CourseEditor] Calling onSubmit...");
        await onSubmit({ code, name });
        
        console.log("🟠 [CourseEditor] onSubmit completed, resetting form");
        // Reset form only after successful submission
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
