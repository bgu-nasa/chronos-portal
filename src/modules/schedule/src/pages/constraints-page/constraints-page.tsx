import { Tabs, Title, Container, Stack, Divider } from "@mantine/core";
import { ActivityConstraintsTable } from "./components/activity-constraints-table";
import { UserConstraintsTable } from "./components/user-constraints-table";
import { UserPreferencesTable } from "./components/user-preferences-table";
import { OrganizationPoliciesTable } from "./components/organization-policies-table";
import { ConstraintEditor } from "./components/constraint-editor";

export function ConstraintsPage() {
    return (
        <Container size="xl" py="xl">
            <Stack gap="lg">
                <Title order={1}>Constraints Management</Title>
                <Divider />
                <Tabs defaultValue="activity">
                    <Tabs.List>
                        <Tabs.Tab value="constraints">User Constraints</Tabs.Tab>
                        <Tabs.Tab value="preference">User Preferences</Tabs.Tab>
                        <Tabs.Tab value="activity">Activity Constraints</Tabs.Tab>
                        <Tabs.Tab value="policy">Organization Policies</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="constraints" pt="md">
                        <UserConstraintsTable />
                    </Tabs.Panel>
                    <Tabs.Panel value="preference" pt="md">
                        <UserPreferencesTable />
                    </Tabs.Panel>
                    <Tabs.Panel value="activity" pt="md">
                        <ActivityConstraintsTable />
                    </Tabs.Panel>
                    <Tabs.Panel value="policy" pt="md">
                        <OrganizationPoliciesTable />
                    </Tabs.Panel>
                </Tabs>
            </Stack>
            <ConstraintEditor />
        </Container>
    );
}

export default ConstraintsPage;
