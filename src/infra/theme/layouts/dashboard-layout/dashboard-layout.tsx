import { Outlet } from "react-router";
import styles from "./dashboard-layout.module.css";

export default function DashboardLayout() {
    return (
        <div className={styles.dashboardLayoutContainer}>
            <div className={styles.dashboardHeader}>
                <h1>DASHBOARD HEADER PLACEHOLDER</h1>
            </div>

            <div className={styles.dashboardScreen}>
                <div className={styles.dashboardSidebar}>
                    <h3>SIDEBAR PLACEHOLDER</h3>
                </div>

                <div className={styles.dashboardContent}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
