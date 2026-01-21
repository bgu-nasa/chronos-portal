import { Button, TextInput, Group, Paper } from "@mantine/core";
import { DepartmentSelect } from "@/common/components/department-select";
import { useState, useEffect } from "react";

export interface SubjectSearchFilters {
    departmentId: string;
    code: string;
    name: string;
}

interface SubjectSearchProps {
    onSearch: (filters: SubjectSearchFilters) => void;
    onClear: () => void;
}

export function SubjectSearch({ onSearch, onClear }: SubjectSearchProps) {
    const [departmentId, setDepartmentId] = useState<string>("");
    const [code, setCode] = useState("");
    const [name, setName] = useState("");

    // Automatically trigger search when department changes
    useEffect(() => {
        if (departmentId) {
            onSearch({ departmentId, code, name });
        }
        // Note: We only want to trigger on departmentId changes, not code/name
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departmentId]);

    const handleSearch = () => {
        onSearch({ departmentId, code, name });
    };

    const handleClear = () => {
        setDepartmentId("");
        setCode("");
        setName("");
        onClear();
    };

    return (
        <Paper shadow="xs" p="md" mb="md">
            <Group align="flex-end">
                <DepartmentSelect
                    value={departmentId}
                    onChange={(value) => setDepartmentId(value || "")}
                    label="Department"
                    placeholder="Select department"
                    style={{ flex: 1 }}
                />
                <TextInput
                    label="Course Code"
                    placeholder="e.g. CS101"
                    value={code}
                    onChange={(e) => setCode(e.currentTarget.value)}
                    style={{ flex: 1 }}
                />
                <TextInput
                    label="Course Name"
                    placeholder="e.g. Operating Systems"
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                    style={{ flex: 1 }}
                />
                <Button onClick={handleSearch}>Search</Button>
                <Button variant="outline" onClick={handleClear}>
                    Clear Filters
                </Button>
            </Group>
        </Paper>
    );
}
