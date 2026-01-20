import { useEffect, useState, useMemo } from "react";
import { Table, Button, Group, Text, Badge, ActionIcon, Loader } from "@mantine/core";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { 
    useUserConstraints, 
    useUserPreferences, 
    useSchedulingPeriods 
} from "@/modules/schedule/src/hooks";
import { useUsers } from "@/modules/auth/src/hooks";
import { UserConstraintEditor } from "./user-constraint-editor";
import { $app } from "@/infra/service";

interface UserConstraintsPanelProps {
    readonly isAdmin: boolean;
    readonly openConfirmation: (params: {
        title: string;
        message: string;
        onConfirm: () => Promise<void>;
    }) => void;
}

export function UserConstraintsPanel({ isAdmin, openConfirmation }: UserConstraintsPanelProps) {
    const [modalOpened, setModalOpened] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isPreference, setIsPreference] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string>("");

    // Initialize hooks
    const { userConstraints, isLoading: constraintsLoading, fetchUserConstraints, fetchUserConstraintsByUser, createUserConstraint, updateUserConstraint, deleteUserConstraint } = useUserConstraints();
    const { userPreferences, isLoading: preferencesLoading, fetchUserPreferences, fetchUserPreferencesByUser, createUserPreference, updateUserPreference, deleteUserPreference } = useUserPreferences();
    const { users, isLoading: usersLoading, fetchUsers } = useUsers();
    const { schedulingPeriods, isLoading: periodsLoading, fetchSchedulingPeriods } = useSchedulingPeriods();

    const isLoading = constraintsLoading || preferencesLoading || usersLoading || periodsLoading;

    // Initial fetch
    useEffect(() => {
        const org = $app.organization.getOrganization();
        const userId = org?.userRoles?.[0]?.userId;
        if (userId) {
            setCurrentUserId(userId);
        }

        if (isAdmin) {
            fetchUserConstraints();
            fetchUserPreferences();
            fetchUsers();
            fetchSchedulingPeriods();
        } else if (userId) {
            fetchUserConstraintsByUser(userId);
            fetchUserPreferencesByUser(userId);
            fetchSchedulingPeriods();
        }
    }, [isAdmin]);

    // Combined and enriched data
    const enrichedData = useMemo(() => {
        const combine = [
            ...userConstraints.map((c: any) => ({ ...c, type: 'constraint' })),
            ...userPreferences.map((p: any) => ({ ...p, type: 'preference' }))
        ];

        return combine.map(item => {
            const user = users.find((u: any) => u.id === item.userId);
            const period = schedulingPeriods.find((p: any) => p.id === item.schedulingPeriodId);
            
            return {
                ...item,
                userName: user ? `${user.firstName} ${user.lastName}` : item.userId,
                periodName: period ? period.name : item.schedulingPeriodId
            };
        });
    }, [userConstraints, userPreferences, users, schedulingPeriods]);

    const handleCreate = (pref: boolean) => {
        setIsPreference(pref);
        setEditingItem(null);
        setModalOpened(true);
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setIsPreference(item.type === 'preference');
        setModalOpened(true);
    };

    const handleDelete = (item: any) => {
        openConfirmation({
            title: `Delete ${item.type === 'preference' ? 'Preference' : 'Constraint'}`,
            message: `Are you sure you want to delete this ${item.type}?`,
            onConfirm: async () => {
                if (item.type === 'preference') {
                    await deleteUserPreference(item.id);
                } else {
                    await deleteUserConstraint(item.id);
                }
                
                // Refetch data to update the table immediately
                if (isAdmin) {
                    if (item.type === 'preference') {
                        await fetchUserPreferences();
                    } else {
                        await fetchUserConstraints();
                    }
                } else if (currentUserId) {
                    if (item.type === 'preference') {
                        await fetchUserPreferencesByUser(currentUserId);
                    } else {
                        await fetchUserConstraintsByUser(currentUserId);
                    }
                }
            },
        });
    };

    const handleSubmit = async (values: any) => {
        try {
            if (editingItem) {
                if (isPreference) {
                    await updateUserPreference(editingItem.userId, editingItem.schedulingPeriodId, editingItem.key, { value: values.value });
                } else {
                    await updateUserConstraint(editingItem.id, values);
                }
            } else if (isPreference) {
                await createUserPreference(values);
            } else {
                await createUserConstraint(values);
            }
            
            // Refetch data to update the table immediately
            if (isAdmin) {
                if (isPreference) {
                    await fetchUserPreferences();
                } else {
                    await fetchUserConstraints();
                }
            } else if (currentUserId) {
                if (isPreference) {
                    await fetchUserPreferencesByUser(currentUserId);
                } else {
                    await fetchUserConstraintsByUser(currentUserId);
                }
            }
            
            setModalOpened(false);
        } catch (error) {
            console.error("Error saving user constraint:", error);
        }
    };

    if (isLoading && enrichedData.length === 0 && !modalOpened) {
        return (
            <Group justify="center" py="xl">
                <Loader size="lg" />
            </Group>
        );
    }

    return (
        <div>
            <Group mb="md" justify="space-between">
                <Group>
                    <Button variant="filled" onClick={() => handleCreate(false)}>
                        Create Constraint
                    </Button>
                    <Button variant="outline" onClick={() => handleCreate(true)}>
                        Create Preference
                    </Button>
                </Group>
                {isLoading && <Loader size="xs" />}
            </Group>

            {enrichedData.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">
                    No constraints or preferences found.
                </Text>
            ) : (
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            {isAdmin && <Table.Th>Lecturer</Table.Th>}
                            <Table.Th>Period</Table.Th>
                            <Table.Th>Type</Table.Th>
                            <Table.Th>Key</Table.Th>
                            <Table.Th>Value</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {enrichedData.map((item) => (
                            <Table.Tr key={item.id}>
                                {isAdmin && <Table.Td>{item.userName}</Table.Td>}
                                <Table.Td>{item.periodName}</Table.Td>
                                <Table.Td>
                                    <Badge color={item.type === 'constraint' ? 'red' : 'blue'} variant="light">
                                        {item.type === 'constraint' ? 'Hard' : 'Soft'}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>{item.key}</Table.Td>
                                <Table.Td>{item.value}</Table.Td>
                                <Table.Td>
                                    <Group gap="xs">
                                        <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(item)}>
                                            <HiOutlinePencil />
                                        </ActionIcon>
                                        <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(item)}>
                                            <HiOutlineTrash />
                                        </ActionIcon>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            )}

            <UserConstraintEditor
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                onSubmit={handleSubmit}
                initialData={editingItem}
                isAdmin={isAdmin}
                currentUserId={currentUserId}
                loading={isLoading}
                isPreference={isPreference}
            />
        </div>
    );
}
