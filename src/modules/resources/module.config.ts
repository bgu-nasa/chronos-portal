import type { ModuleConfig } from "@/infra";
import React from "react";
import { SubjectsPage, ActivitiesPage } from "./src/pages";
// import { SubjectsIcon } from "@/common/icons";

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
    ],
    navigationItems: [
        {
            label: "Courses",
            href: "/resources/subjects",
            location: "dashboard",
            // icon: React.createElement(SubjectsIcon),
        },
    ],
};
