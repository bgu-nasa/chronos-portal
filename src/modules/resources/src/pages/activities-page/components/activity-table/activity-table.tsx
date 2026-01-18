import { DataTable } from "primereact/datatable";
import type { DataTableSelectionSingleChangeEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Text, Stack, Avatar, Group } from "@mantine/core";
import { useState, useEffect } from "react";
import { fetchUsersInOrganization } from "@/common/components/user-select/fetch-users";
import type { User } from "@/common/components/user-select/user.types";
import type { ActivityData } from "./types";
import resources from "../../activities-page.resources.json";
import { $app } from "@/infra/service";

interface ActivityTableProps {
    activities: ActivityData[];
    selectedActivity: ActivityData | null;
    onSelectionChange: (activity: ActivityData | null) => void;
    loading?: boolean;
}

export function ActivityTable({
    activities,
    selectedActivity,
    onSelectionChange,
    loading: externalLoading,
}: ActivityTableProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchUsersInOrganization();
                setUsers(data);
            } catch (error) {
                $app.logger.error("[ActivityTable] Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    const handleSelectionChange = (
        e: DataTableSelectionSingleChangeEvent<ActivityData[]>
    ) => {
        onSelectionChange(e.value as ActivityData | null);
    };

    const userTemplate = (rowData: ActivityData) => {
        const user = users.find((u) => u.id === rowData.assignedUserId);
        
        if (!user) {
            return (
                <Text size="sm" c="dimmed">
                    Unassigned
                </Text>
            );
        }

        return (
            <Group wrap="nowrap" gap="sm">
                <Avatar src={user.avatarUrl} size="sm" radius="xl" />
                <Text size="sm">{`${user.firstName} ${user.lastName}`}</Text>
            </Group>
        );
    };

    const emptyMessage = () => {
        return (
            <Stack align="center" justify="center" style={{ padding: "3rem" }}>
                <Text size="lg" c="dimmed" ta="center">
                    {resources.emptyStateMessage}
                </Text>
            </Stack>
        );
    };

    return (
        <DataTable
            value={activities}
            selection={selectedActivity}
            onSelectionChange={handleSelectionChange}
            selectionMode="single"
            dataKey="id"
            stripedRows
            paginator
            rows={10}
            emptyMessage={emptyMessage()}
            loading={loading || externalLoading}
            pt={{
                root: { style: { backgroundColor: "transparent" } },
                wrapper: { style: { backgroundColor: "transparent" } },
                table: { style: { backgroundColor: "transparent" } },
            }}
        >
            <Column selectionMode="single" headerStyle={{ width: "3rem" }} />
            <Column field="activityType" header={resources.activityTypeColumn} sortable />
            <Column 
                field="assignedUserId" 
                header={resources.assignedUserColumn} 
                body={userTemplate}
                sortable 
            />
            <Column 
                field="expectedStudents" 
                header={resources.expectedStudentsColumn} 
                sortable 
                body={(rowData: ActivityData) => rowData.expectedStudents ?? "N/A"}
            />
        </DataTable>
    );
}
