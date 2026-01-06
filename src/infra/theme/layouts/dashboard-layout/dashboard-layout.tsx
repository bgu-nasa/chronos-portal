/** @author aaron-iz */
import { Outlet } from "react-router";
import { AppShell, Image } from "@mantine/core";
import styles from "./dashboard-layout.module.css";

function TemporaryLogo() {
    return <Image src="/logo.png" alt="Logo" h={40} w="auto" />;
}

export default function DashboardLayout() {
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

            <AppShell.Navbar>Navbar</AppShell.Navbar>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
