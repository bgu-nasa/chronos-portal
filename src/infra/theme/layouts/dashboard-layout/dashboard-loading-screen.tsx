/** @author aaron-iz */
import { Loader, Center } from "@mantine/core";

/**
 * Loading screen component for the dashboard
 * Displays a centered loader with bars variant while organization data is being fetched
 */
export function DashboardLoadingScreen() {
    return (
        <Center style={{ flexGrow: 1, width: "100%" }}>
            <Loader size="xl" type="bars" />
        </Center>
    );
}
