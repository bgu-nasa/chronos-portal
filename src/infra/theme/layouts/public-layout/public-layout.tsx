/** @author aaron-iz */
import {
    AppShell,
    AppShellHeader,
    AppShellMain,
    Image,
    NavLink,
    Group,
} from "@mantine/core";
import { Outlet } from "react-router";
import styles from "./public-layout.module.css";
import PublicLayoutSpecialAction from "./special-action";
import { ThemeToggleButton } from "@/infra/theme/components/theme-toggle-button";
import { ApplicationNavigationRepository as NavItemsRepo } from "@/infra/federation";

const propStyles = {
    headerConfig: {
        height: 60,
        padding: "xs",
    },
    navLinkStyle: {
        miw: 100,
        w: "fit-content",
    },
};

function TemporaryLogo() {
    return <Image src="/logo.png" alt="Logo" h={40} w="auto" />;
}

export default function PublicLayout() {
    const publicNavItems = NavItemsRepo.getPublicNavigationItems();

    const getNavigationKey = (label: string) =>
        `pni-${label.toLowerCase().replace(/\s+/g, "-")}`;

    return (
        <AppShell header={propStyles.headerConfig}>
            <AppShellHeader>
                <div className={styles.publicLayoutHeaderStack}>
                    <TemporaryLogo />

                    <div className={styles.publicLayoutNavigationContainer}>
                        {publicNavItems.map((item) => (
                            <NavLink
                                key={getNavigationKey(item.label)}
                                href={item.href}
                                label={item.label}
                                leftSection={item.icon}
                                {...propStyles.navLinkStyle}
                            />
                        ))}

                        <Group gap="sm">
                            <ThemeToggleButton />
                            <PublicLayoutSpecialAction />
                        </Group>
                    </div>
                </div>
            </AppShellHeader>

            <AppShellMain className={styles.publicLayoutMain}>
                <Outlet />
            </AppShellMain>
        </AppShell>
    );
}
