import { Button, TextInput, Group, Paper } from "@mantine/core";
import { DepartmentSelect } from "@/common/components/department-select";
import { useState } from "react";

export interface CourseSearchFilters {
    departmentId: string;
    code: string;
    name: string;
}

interface CourseSearchProps {
    onSearch: (filters: CourseSearchFilters) => void;
    onClear: () => void;
}

export function CourseSearch({ onSearch, onClear }: CourseSearchProps) {
    const [departmentId, setDepartmentId] = useState<string>("");
    const [code, setCode] = useState("");
    const [name, setName] = useState("");

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
