import type { ModuleConfig } from "@/infra";
import React from "react";
import { LoginPage, RegisterPage, UsersPage } from "./src/pages";
import { HiOutlineUsers } from "react-icons/hi";

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
        {
            authorize: true,
            name: "users",
            path: "/users",
            element: React.createElement(UsersPage),
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
        {
            label: "User Management",
            href: "/auth/users",
            location: "dashboard",
            icon: React.createElement(HiOutlineUsers),
        },
    ],
};
