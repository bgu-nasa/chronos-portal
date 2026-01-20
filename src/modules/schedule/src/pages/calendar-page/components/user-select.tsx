import { useEffect } from "react";
import { Select, Stack, Text } from "@mantine/core";

import { useUsers } from "@/modules/auth/src/hooks";

interface UserSelectProps {
    readonly value: string | null;
    readonly onChange: (value: string | null) => void;
    readonly disabled?: boolean;
}

export function UserSelect({ value, onChange, disabled = false }: UserSelectProps) {
    const { users, isLoading, fetchUsers } = useUsers();

    useEffect(() => {
        void fetchUsers();
    }, [fetchUsers]);

    const data = users.map((user) => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName}`,
    }));

    return (
        <Stack gap="xs">
            <Text size="sm" fw={500}>
                User
            </Text>
            <Select
                placeholder="Select user to view constraints"
                data={data}
                value={value}
                onChange={onChange}
                disabled={isLoading || disabled}
                nothingFoundMessage="No users found"
                searchable={!disabled}
                clearable={!disabled}
            />
        </Stack>
    );
}
