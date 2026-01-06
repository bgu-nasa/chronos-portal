import { useState } from "react";
import { Container, Divider, Title } from "@mantine/core";
import { UserActions } from "@/modules/auth/src/pages/users/components/user-actions";
import { UserTable } from "@/modules/auth/src/pages/users/components/user-table/user-table";
import type { UserData } from "@/modules/auth/src/pages/users/components/user-table/types";
import resources from "@/modules/auth/src/pages/users/users-page.resources.json";
import styles from "./users-page.module.css";

// Mock data for testing the UI
const mockUsers: UserData[] = [
    {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        avatarUrl: "https://i.pravatar.cc/150?img=1",
        verified: true,
    },
    {
        id: "2",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        avatarUrl: "https://i.pravatar.cc/150?img=2",
        verified: false,
    },
    {
        id: "3",
        firstName: "Mike",
        lastName: "Johnson",
        email: "mike.johnson@example.com",
        verified: true,
    },
    {
        id: "4",
        firstName: "Sarah",
        lastName: "Williams",
        email: "sarah.williams@example.com",
        avatarUrl: "https://i.pravatar.cc/150?img=4",
        verified: true,
    },
    {
        id: "5",
        firstName: "David",
        lastName: "Brown",
        email: "david.brown@example.com",
        avatarUrl: "https://i.pravatar.cc/150?img=5",
        verified: false,
    },
];

export function UsersPage() {
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

    const handleCreateClick = () => {
        console.log("Create user clicked");
        // TODO: Implement create user logic
    };

    const handleEditClick = () => {
        console.log("Edit user clicked", selectedUser);
        // TODO: Implement edit user logic
    };

    const handleDeleteClick = () => {
        console.log("Delete user clicked", selectedUser);
        // TODO: Implement delete user logic
    };

    return (
        <Container size="xl" py="xl">
            <div className={styles.container}>
                <Title order={1}>{resources.title}</Title>
                <Divider className={styles.divider} />

                <UserActions
                    selectedUser={selectedUser}
                    onCreateClick={handleCreateClick}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                />

                <UserTable
                    users={mockUsers}
                    selectedUser={selectedUser}
                    onSelectionChange={setSelectedUser}
                />
            </div>
        </Container>
    );
}
