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
import resources from "../constraints-page.resources.json";

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
            ...userConstraints.map((c: any) => ({ ...c, type: resources.constraintTypes.constraint })),
            ...userPreferences.map((p: any) => ({ ...p, type: resources.constraintTypes.preference }))
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
        setIsPreference(item.type === resources.constraintTypes.preference);
        setModalOpened(true);
    };

    const handleDelete = (item: any) => {
        const isPreferenceType = item.type === resources.constraintTypes.preference;
        openConfirmation({
            title: isPreferenceType ? resources.deleteMessages.deletePreference : resources.deleteMessages.deleteConstraint,
            message: isPreferenceType ? resources.deleteMessages.confirmDeletePreference : resources.deleteMessages.confirmDeleteConstraint,
            onConfirm: async () => {
                if (isPreferenceType) {
                    await deleteUserPreference(item.id);
                } else {
                    await deleteUserConstraint(item.id);
                }

                // Refetch data to update the table immediately
                if (isAdmin) {
                    if (isPreferenceType) {
                        await fetchUserPreferences();
                    } else {
                        await fetchUserConstraints();
                    }
                } else if (currentUserId) {
                    if (isPreferenceType) {
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
            console.error(resources.errorMessages.saveUserConstraint, error);
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
                        {resources.createConstraintButton}
                    </Button>
                    <Button variant="outline" onClick={() => handleCreate(true)}>
                        {resources.createPreferenceButton}
                    </Button>
                </Group>
                {isLoading && <Loader size="xs" />}
            </Group>

            {enrichedData.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">
                    {resources.emptyStateMessages.noConstraintsOrPreferences}
                </Text>
            ) : (
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            {isAdmin && <Table.Th>{resources.labels.lecturer}</Table.Th>}
                            <Table.Th>{resources.labels.period}</Table.Th>
                            <Table.Th>{resources.labels.type}</Table.Th>
                            <Table.Th>{resources.labels.key}</Table.Th>
                            <Table.Th>{resources.labels.value}</Table.Th>
                            <Table.Th>{resources.labels.actions}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {enrichedData.map((item) => (
                            <Table.Tr key={item.id}>
                                {isAdmin && <Table.Td>{item.userName}</Table.Td>}
                                <Table.Td>{item.periodName}</Table.Td>
                                <Table.Td>
                                    <Badge variant="light">
                                        {item.type === resources.constraintTypes.constraint ? resources.badgeLabels.constraint : resources.badgeLabels.preference}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>{item.key}</Table.Td>
                                <Table.Td>{item.value}</Table.Td>
                                <Table.Td>
                                    <Group gap="xs">
                                        <ActionIcon variant="subtle" onClick={() => handleEdit(item)}>
                                            <HiOutlinePencil />
                                        </ActionIcon>
                                        <ActionIcon variant="subtle" onClick={() => handleDelete(item)}>
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
