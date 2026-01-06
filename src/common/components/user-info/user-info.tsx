/**
 * UserInfo Component
 * Displays user information with avatar, full name, and email
 * Reusable component for showing user details in various contexts
 */

import { Group, Avatar, Text, Stack } from "@mantine/core";

interface UserInfoProps {
    avatarUrl?: string | null;
    firstName: string;
    lastName: string;
    email: string;
    avatarSize?: "sm" | "md" | "lg";
}

export function UserInfo({
    avatarUrl,
    firstName,
    lastName,
    email,
    avatarSize = "md",
}: UserInfoProps) {
    const fullName = `${firstName} ${lastName}`;

    return (
        <Group wrap="nowrap">
            <Avatar src={avatarUrl} size={avatarSize} radius="xl" />
            <Stack gap={0}>
                <Text size="sm" fw={500}>
                    {fullName}
                </Text>
                <Text size="xs" c="dimmed" fw={300}>
                    {email}
                </Text>
            </Stack>
        </Group>
    );
}
