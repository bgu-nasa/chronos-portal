import type { ModuleConfig } from "@/infra";
import React from "react";
import {
    HiOutlineBriefcase,
    HiOutlineClipboardList,
    HiOutlineLockOpen,
} from "react-icons/hi";
import { DepartmentsPage } from "./src/pages/departments-page";
import { RolesPage } from "./src";

export const moduleConfig: ModuleConfig = {
    name: "management",
    owner: "",
    basePath: "/management",
    routes: [
        {
            authorize: true,
            name: "departments",
            path: "/departments",
            element: React.createElement(DepartmentsPage),
        },
        {
            authorize: true,
            name: "roles",
            path: "/roles",
            element: React.createElement(RolesPage),
        },
    ],
    navigationItems: [
        {
            label: "Management",
            location: "dashboard",
            icon: React.createElement(HiOutlineBriefcase),
            children: [
                {
                    label: "Departments",
                    href: "/management/departments",
                    location: "dashboard",
                    icon: React.createElement(HiOutlineClipboardList),
                },
                {
                    label: "Access Control",
                    href: "/management/roles",
                    location: "dashboard",
                    icon: React.createElement(HiOutlineLockOpen),
                },
            ],
        },
    ],
};
