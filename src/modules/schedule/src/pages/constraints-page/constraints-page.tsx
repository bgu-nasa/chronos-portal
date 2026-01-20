import { useEffect, useState } from "react";
import { Container, Divider, Title, Tabs } from "@mantine/core";
import { ConfirmationDialog, useConfirmation } from "@/common";
// Import specialized panels
import { 
    UserConstraintsPanel, 
    ActivityConstraintsPanel, 
    OrganizationPoliciesPanel 
} from "./components";
import resources from "./constraints-page.resources.json";
import styles from "./constraints-page.module.css";
import { $app } from "@/infra/service";

export function ConstraintsPage() {
    const [activeTab, setActiveTab] = useState<string | null>("user");
    const [isAdmin, setIsAdmin] = useState(false);

    const {
        confirmationState,
        openConfirmation,
        closeConfirmation,
        handleConfirm,
        isLoading: isConfirming,
    } = useConfirmation();

    // Determine user role
    useEffect(() => {
        const userIsAdmin = $app.organization.isAdministrator();
        setIsAdmin(userIsAdmin);
        $app.logger.info("[ConstraintsPage] User is admin:", userIsAdmin);
    }, []);

    return (
        <Container size="xl" py="xl">
            <div className={styles.container}>
                <Title order={1}>{resources.title}</Title>
                <Divider className={styles.divider} />

                <Tabs
                    value={activeTab}
                    onChange={setActiveTab}
                    className={styles.tabsContainer}
                >
                    <Tabs.List>
                        <Tabs.Tab value="user">User Constraints / Preferences</Tabs.Tab>
                        {isAdmin && (
                            <>
                                <Tabs.Tab value="activity">Activity Constraints</Tabs.Tab>
                                <Tabs.Tab value="organization">Organization Policies</Tabs.Tab>
                            </>
                        )}
                    </Tabs.List>

                    <Tabs.Panel value="user" pt="md">
                        {activeTab === "user" && (
                            <UserConstraintsPanel 
                                isAdmin={isAdmin} 
                                openConfirmation={openConfirmation} 
                            />
                        )}
                    </Tabs.Panel>

                    {isAdmin && (
                        <>
                            <Tabs.Panel value="activity" pt="md">
                                {activeTab === "activity" && (
                                    <ActivityConstraintsPanel 
                                        openConfirmation={openConfirmation} 
                                    />
                                )}
                            </Tabs.Panel>

                            <Tabs.Panel value="organization" pt="md">
                                {activeTab === "organization" && (
                                    <OrganizationPoliciesPanel 
                                        openConfirmation={openConfirmation} 
                                    />
                                )}
                            </Tabs.Panel>
                        </>
                    )}
                </Tabs>

                <ConfirmationDialog
                    opened={confirmationState.isOpen}
                    onClose={closeConfirmation}
                    onConfirm={handleConfirm}
                    title={confirmationState.title}
                    message={confirmationState.message}
                    confirmText={resources.deleteConfirmButton}
                    cancelText={resources.deleteCancelButton}
                    loading={isConfirming}
                />
            </div>
        </Container>
    );
}
