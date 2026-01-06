import type { ModuleConfig } from "@/infra";
import React from "react";
import {
    HiOutlineBriefcase,
    HiOutlineClipboardList,
    HiOutlineLockOpen,
} from "react-icons/hi";

export const moduleConfig: ModuleConfig = {
    name: "management",
    owner: "",
    basePath: "/management",
    routes: [],
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
