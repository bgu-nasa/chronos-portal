/** @author aaron-iz */
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { MantineProvider } from "@mantine/core";
import { PrimeReactProvider } from "primereact/api";
import { theme } from "./theme";
import { useThemeStore } from "./theme/state";
import App from "./App";
import "@mantine/core/styles.css";
import "primereact/resources/primereact.min.css";

const ThemedApp = () => {
    const colorScheme = useThemeStore((state) => state.colorScheme);

    useEffect(() => {
        // Dynamically load PrimeReact theme
        const themeLink = document.getElementById(
            "primereact-theme"
        ) as HTMLLinkElement;
        const themePath =
            colorScheme === "dark"
                ? "/node_modules/primereact/resources/themes/lara-dark-indigo/theme.css"
                : "/node_modules/primereact/resources/themes/lara-light-indigo/theme.css";

        if (themeLink) {
            themeLink.href = themePath;
        } else {
            const link = document.createElement("link");
            link.id = "primereact-theme";
            link.rel = "stylesheet";
            link.href = themePath;
            document.head.appendChild(link);
        }
    }, [colorScheme]);

    return (
        <MantineProvider theme={theme} forceColorScheme={colorScheme}>
            <PrimeReactProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </PrimeReactProvider>
        </MantineProvider>
    );
};

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemedApp />
    </StrictMode>
);
