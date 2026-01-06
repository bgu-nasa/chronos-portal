import { Card, Title, Text, ThemeIcon, Stack } from "@mantine/core";
import type { ReactNode } from "react";

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
                <ThemeIcon size="xl" radius="md">
                    {icon}
                </ThemeIcon>
                <div>
                    <Title order={4} mb="xs">
                        {title}
                    </Title>
                    <Text size="sm" c="dimmed">
                        {description}
                    </Text>
                </div>
            </Stack>
        </Card>
    );
}
