import type { ModuleConfig } from "@/infra";
import React from "react";
import { LoginPage } from "./src/pages";

export const moduleConfig: ModuleConfig = {
    name: "Auth",
    owner: "",
    basePath: "/auth",
    routes: [
        {
            name: "login",
            path: "/login", // Route will be /auth/login
            element: React.createElement(LoginPage),
        },
    ],
    navigationItems: [
        {
            label: "Login",
            href: "/auth/login",
            location: "public",
        },
    ],
};
