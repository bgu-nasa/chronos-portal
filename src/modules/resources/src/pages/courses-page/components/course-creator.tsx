import { Modal, TextInput, Button, Stack } from "@mantine/core";
import { useState } from "react";

interface CourseCreatorProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: { code: string; name: string }) => Promise<void>;
    loading?: boolean;
}

export function CourseCreator({
    opened,
    onClose,
    onSubmit,
    loading = false,
}: CourseCreatorProps) {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = async () => {
        console.log("🟡 [CourseCreator] handleSubmit called", { code, name });
        
        if (!code.trim() || !name.trim()) {
            console.warn("🟡 [CourseCreator] Validation failed - empty fields");
            return;
        }
        
        console.log("🟡 [CourseCreator] Calling onSubmit...");
        await onSubmit({ code, name });
        
        console.log("🟡 [CourseCreator] onSubmit completed, resetting form");
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
