import type { ModuleConfig } from "@/infra";
import React from "react";
import { LoginPage, RegisterPage } from "./src/pages";

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
        {
            name: "register",
            path: "/register", // Route will be /auth/register
            element: React.createElement(RegisterPage),
        },
    ],
    navigationItems: [
        {
            label: "Login",
            href: "/auth/login",
            location: "public",
            order: 10,
        },
        {
            label: "Register",
            href: "/auth/register",
            location: "public",
            order: 20,
        },
    ],
};
