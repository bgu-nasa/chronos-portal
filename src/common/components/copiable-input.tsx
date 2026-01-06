import { TextInput, ActionIcon, Tooltip } from "@mantine/core";
import { useState } from "react";
import { FaRegCopy } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";

interface CopiableInputProps {
    label: string;
    value: string;
    placeholder?: string;
}

/**
 * CopiableInput component
 * A disabled/read-only input with a copy button
 */
export function CopiableInput({
    label,
    value,
    placeholder,
}: CopiableInputProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <TextInput
            label={label}
            value={value}
            placeholder={placeholder}
            readOnly
            styles={{
                input: {
                    backgroundColor: "var(--mantine-color-gray-0)",
                    color: "var(--mantine-color-gray-7)",
                    cursor: "default",
                },
            }}
            rightSection={
                <Tooltip label={copied ? "Copied!" : "Copy to clipboard"}>
                    <ActionIcon
                        variant="subtle"
                        color={copied ? "teal" : "gray"}
                        onClick={handleCopy}
                    >
                        {copied ? <FaCheck /> : <FaRegCopy />}
                    </ActionIcon>
                </Tooltip>
            }
        />
    );
}
