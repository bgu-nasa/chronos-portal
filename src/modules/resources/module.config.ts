import type { ModuleConfig } from "@/infra";
import React from "react";
import { ResourceTypesPage, ResourcesPage, SubjectsPage, ActivitiesPage } from "./src/pages";

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
            name: "resource-types",
            path: "/resource-types",
            element: React.createElement(ResourceTypesPage),
        },
        {
            authorize: true,
            name: "resources",
            path: "/resources-list",
            element: React.createElement(ResourcesPage),
        },
    ],
    navigationItems: [
        {
            label: "Courses",
            href: "/resources/subjects",
            location: "dashboard",
        },
        {
            label: "Resource Types",
            href: "/resources/resource-types",
            location: "dashboard",
        },
        {
            label: "Resources",
            href: "/resources/resources-list",
            location: "dashboard",
        },
    ],
};
