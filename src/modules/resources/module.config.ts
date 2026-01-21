import type { ModuleConfig } from "@/infra";
import React from "react";
import { ResourcesPage, SubjectsPage, ActivitiesPage } from "./src/pages";
import { ResourcesIcon, CoursesIcon, ResourceManagementIcon } from "@/common/icons";

export const moduleConfig: ModuleConfig = {
    name: "Resources",
    owner: "",
    basePath: "/resources",
    routes: [
        {
            authorize: true,
            name: "subjects",
            path: "/subjects",
            element: React.createElement(SubjectsPage),
        },
        {
            authorize: true,
            name: "activities",
            path: "/activities",
            element: React.createElement(ActivitiesPage),
        },
        {
            authorize: true,
            name: "resources",
            path: "/manage",
            element: React.createElement(ResourcesPage),
        },
    ],
    navigationItems: [
        {
            label: "Resources",
            location: "dashboard",
            icon: React.createElement(ResourcesIcon),
            children: [
                {
                    label: "Courses",
                    href: "/resources/subjects",
                    location: "dashboard",
                    requiredRoles: [
                        "Viewer"
                    ],
                    icon: React.createElement(CoursesIcon),
                },
                {
                    label: "Resources",
                    href: "/resources/manage",
                    location: "dashboard",
                    icon: React.createElement(ResourceManagementIcon),
                },
            ],
        },
    ],
};
