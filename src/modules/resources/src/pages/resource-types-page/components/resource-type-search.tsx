import { Button, Group, Paper } from "@mantine/core";
import { DepartmentSelect } from "@/common/components/department-select";
import { useState } from "react";
import resources from "../resource-types-page.resources.json";

export interface ResourceTypeSearchFilters {
    departmentId: string;
}

interface ResourceTypeSearchProps {
    onSearch: (filters: ResourceTypeSearchFilters) => void;
    onClear: () => void;
}

export function ResourceTypeSearch({ onSearch, onClear }: ResourceTypeSearchProps) {
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
