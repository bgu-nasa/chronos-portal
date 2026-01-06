/** @author aaron-iz */
import { Outlet, useLocation, useNavigate } from "react-router";
import { AppShell, Image, NavLink, Stack } from "@mantine/core";
import styles from "./dashboard-layout.module.css";
import { useDashboardNavigation } from "./use-dashboard-navigation";
import type { NavigationItem } from "@/infra/federation/module.types";

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
            onClick={() => navigate(item.href)}
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
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
