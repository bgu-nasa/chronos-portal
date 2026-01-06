import { Paper, Title, Text, Stack } from "@mantine/core";

interface InfoSectionProps {
    title: string;
    content: string[];
}

export function InfoSection({ title, content }: InfoSectionProps) {
    return (
        <Paper shadow="sm" p="lg" radius="md" withBorder>
            <Stack gap="md">
                <Title order={3}>{title}</Title>
                {content.map((paragraph, index) => (
                    <Text key={index} size="sm">
                        {paragraph}
                    </Text>
                ))}
            </Stack>
        </Paper>
    );
}
