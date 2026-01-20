import { useEffect, useState, useMemo } from "react";
import { Table, Button, Group, Text, ActionIcon, Loader } from "@mantine/core";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import {
    useOrganizationPolicies,
    useSchedulingPeriods
} from "@/modules/schedule/src/hooks";
import { OrganizationPolicyEditor } from "./organization-policy-editor";
import resources from "../constraints-page.resources.json";

interface OrganizationPoliciesPanelProps {
    readonly isAdmin: boolean;
    readonly openConfirmation: (params: {
        title: string;
        message: string;
        onConfirm: () => Promise<void>;
    }) => void;
}

export function OrganizationPoliciesPanel({ openConfirmation }: Readonly<Omit<OrganizationPoliciesPanelProps, 'isAdmin'>>) {
    const [modalOpened, setModalOpened] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Initialize hooks
    const { organizationPolicies, isLoading: policiesLoading, fetchOrganizationPolicies, createOrganizationPolicy, updateOrganizationPolicy, deleteOrganizationPolicy } = useOrganizationPolicies();
    const { schedulingPeriods, isLoading: periodsLoading, fetchSchedulingPeriods } = useSchedulingPeriods();

    const isLoading = policiesLoading || periodsLoading;

    // Initial fetch
    useEffect(() => {
        fetchOrganizationPolicies();
        fetchSchedulingPeriods();
    }, []);

    // Enriched data
    const enrichedData = useMemo(() => {
        return organizationPolicies.map(item => {
            const period = schedulingPeriods.find((p: any) => p.id === item.schedulingPeriodId);

            return {
                ...item,
                periodName: period ? period.name : item.schedulingPeriodId
            };
        });
    }, [organizationPolicies, schedulingPeriods]);

    const handleCreate = () => {
        setEditingItem(null);
        setModalOpened(true);
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setModalOpened(true);
    };

    const handleDelete = (item: any) => {
        openConfirmation({
            title: resources.deleteMessages.deleteOrganizationPolicy,
            message: resources.deleteMessages.confirmDeleteOrganizationPolicy,
            onConfirm: async () => {
                await deleteOrganizationPolicy(item.id);
            },
        });
    };

    const handleSubmit = async (values: any) => {
        try {
            if (editingItem) {
                await updateOrganizationPolicy(editingItem.id, values);
            } else {
                await createOrganizationPolicy(values);
            }
            setModalOpened(false);
        } catch (error) {
            console.error(resources.errorMessages.saveOrganizationPolicy, error);
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
                <Button variant="filled" onClick={handleCreate}>
                    {resources.modalTitles.createOrganizationPolicy}
                </Button>
                {isLoading && <Loader size="xs" />}
            </Group>

            {enrichedData.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">
                    {resources.emptyStateMessages.noOrganizationPolicies}
                </Text>
            ) : (
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{resources.labels.period}</Table.Th>
                            <Table.Th>{resources.labels.key}</Table.Th>
                            <Table.Th>{resources.labels.value}</Table.Th>
                            <Table.Th>{resources.labels.actions}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {enrichedData.map((item) => (
                            <Table.Tr key={item.id}>
                                <Table.Td>{item.periodName}</Table.Td>
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

            <OrganizationPolicyEditor
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                onSubmit={handleSubmit}
                initialData={editingItem}
                loading={isLoading}
            />
        </div>
    );
}
