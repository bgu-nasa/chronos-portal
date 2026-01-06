/** @author aaron-iz */
import { Outlet, useLocation, useNavigate } from "react-router";
import { AppShell, Image, NavLink, Stack, Group } from "@mantine/core";
import { useEffect } from "react";
import styles from "./dashboard-layout.module.css";
import { useDashboardNavigation } from "./use-dashboard-navigation";
import { UserCard } from "@/infra/theme/components/user-card";
import { ThemeToggleButton } from "@/infra/theme/components/theme-toggle-button";
import { useOrganization } from "@/infra/service";
import type { NavigationItem } from "@/infra/federation/module.types";
import { DashboardLoadingScreen } from "./dashboard-loading-screen";

function TemporaryLogo() {
    return <Image src="/logo.png" alt="Logo" h={40} w="auto" />;
}

function renderNavigationItems(
    items: NavigationItem[],
    navigate: (path: string) => void,
    currentPath: string
) {
    return items.map((item) => (
        <NavLink
            key={item.href}
            label={item.label}
            leftSection={item.icon}
            active={currentPath === item.href}
            href={item.href}
        >
            {item.children &&
                item.children.length > 0 &&
                renderNavigationItems(item.children, navigate, currentPath)}
        </NavLink>
    ));
}

export default function DashboardLayout() {
    const navigationItems = useDashboardNavigation();
    const navigate = useNavigate();
    const location = useLocation();
    const { fetchOrganization, organization, isLoading, error } =
        useOrganization();

    // Fetch organization information when the dashboard layout mounts
    useEffect(() => {
        // Only fetch if we don't already have organization data
        if (!organization) {
            fetchOrganization().catch((error) => {
                console.error(
                    "Failed to fetch organization information:",
                    error
                );
            });
        }
    }, [fetchOrganization, organization]);

    return (
        <AppShell
            padding="md"
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: "sm",
            }}
        >
            <AppShell.Header>
                <div className={styles.headerContainer}>
                    <TemporaryLogo />
                    <Group gap="sm">
                        <ThemeToggleButton />
                        <UserCard />
                    </Group>
                </div>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <Stack gap="xs">
                    {renderNavigationItems(
                        navigationItems,
                        navigate,
                        location.pathname
                    )}
                </Stack>
            </AppShell.Navbar>

            <AppShell.Main>
                {isLoading && <DashboardLoadingScreen />}
                {error}
                {!isLoading && !error && <Outlet />}
            </AppShell.Main>
        </AppShell>
    );
}
