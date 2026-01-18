import type { ModuleConfig } from "@/infra";
import React from "react";
import { ResourceTypesPage, ResourcesPage } from "./src/pages";

export const moduleConfig: ModuleConfig = {
    name: "Resources",
    owner: "",
    basePath: "/resources",
    routes: [
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
