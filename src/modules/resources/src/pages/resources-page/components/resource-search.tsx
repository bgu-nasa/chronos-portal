import { Button, Group, Paper } from "@mantine/core";
import { DepartmentSelect } from "@/common/components/department-select";
import { useState } from "react";
import resources from "../resources-page.resources.json";

export interface ResourceSearchFilters {
    departmentId: string;
}

interface ResourceSearchProps {
    onSearch: (filters: ResourceSearchFilters) => void;
    onClear: () => void;
}

export function ResourceSearch({ onSearch, onClear }: ResourceSearchProps) {
    const [departmentId, setDepartmentId] = useState<string>("");

    const handleSearch = () => {
        onSearch({ departmentId });
    };

    const handleClear = () => {
        setDepartmentId("");
        onClear();
    };

    return (
        <Paper shadow="xs" p="md" mb="md">
            <Group align="flex-end">
                <DepartmentSelect
                    value={departmentId}
                    onChange={(value) => setDepartmentId(value || "")}
                    label={resources.searchDepartmentLabel}
                    placeholder={resources.searchDepartmentPlaceholder}
                    style={{ flex: 1 }}
                />
                <Button onClick={handleSearch}>{resources.searchButton}</Button>
                <Button variant="outline" onClick={handleClear}>
                    {resources.clearFiltersButton}
                </Button>
            </Group>
        </Paper>
    );
}
