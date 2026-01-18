import type { ModuleConfig } from "@/infra";
import React from "react";
import { ResourcesPage, SubjectsPage, ActivitiesPage } from "./src/pages";

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
            label: "Courses",
            href: "/resources/subjects",
            location: "dashboard",
        },
        {
            label: "Resources",
            href: "/resources/manage",
            location: "dashboard",
        },
    ],
};
