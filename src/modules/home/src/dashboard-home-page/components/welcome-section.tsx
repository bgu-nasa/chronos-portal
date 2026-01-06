import { Title, Text, Paper } from "@mantine/core";

interface WelcomeSectionProps {
    title: string;
    subtitle: string;
}

export function WelcomeSection({ title, subtitle }: WelcomeSectionProps) {
    return (
        <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Title order={1} mb="md">
                {title}
            </Title>
            <Text size="lg" c="dimmed">
                {subtitle}
            </Text>
        </Paper>
    );
}
