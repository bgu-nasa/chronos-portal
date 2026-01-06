import { useState, useEffect } from "react";
import {
    Container,
    Divider,
    Title,
    Loader,
    Center,
    Alert,
} from "@mantine/core";
import { UserActions } from "@/modules/auth/src/pages/users/components/user-actions";
import { UserTable } from "@/modules/auth/src/pages/users/components/user-table/user-table";
import type { UserData } from "@/modules/auth/src/pages/users/components/user-table/types";
import { useUsers } from "@/modules/auth/src/hooks/use-users";
import resources from "@/modules/auth/src/pages/users/users-page.resources.json";
import styles from "./users-page.module.css";

export function UsersPage() {
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const { users, isLoading, error, fetchUsers } = useUsers();

    // Fetch users on mount
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Map UserResponse to UserData for the table component
    const userData: UserData[] = users.map((user) => ({
        id: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatarUrl: user.avatarUrl ?? undefined,
        verified: user.emailVerified,
    }));

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

                {error && (
                    <Alert title="Error" color="red" mb="md">
                        {error}
                    </Alert>
                )}

                <UserActions
                    selectedUser={selectedUser}
                    onCreateClick={handleCreateClick}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                />

                {isLoading ? (
                    <Center mt="xl">
                        <Loader variant="bars" size="lg" />
                    </Center>
                ) : (
                    <UserTable
                        users={userData}
                        selectedUser={selectedUser}
                        onSelectionChange={setSelectedUser}
                    />
                )}
            </div>
        </Container>
    );
}
