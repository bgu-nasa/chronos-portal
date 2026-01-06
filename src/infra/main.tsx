/** @author aaron-iz */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import App from "./App";
import "@mantine/core/styles.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <MantineProvider theme={theme}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </MantineProvider>
    </StrictMode>
);
