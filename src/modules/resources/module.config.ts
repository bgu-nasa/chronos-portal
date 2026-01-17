import type { ModuleConfig } from "@/infra";
import React from "react";
import { CoursesPage, GroupsPage } from "./src/pages";
// import { CoursesIcon } from "@/common/icons";

export const moduleConfig: ModuleConfig = {
    name: "Resources",
    owner: "",
    basePath: "/resources",
    routes: [
        {
            authorize: true,
            name: "courses",
            path: "/courses",
            element: React.createElement(CoursesPage),
        },
        {
            authorize: true,
            name: "groups",
            path: "/groups",
            element: React.createElement(GroupsPage),
        },
    ],
    navigationItems: [
        {
            label: "Courses",
            href: "/resources/courses",
            location: "dashboard",
            // icon: React.createElement(CoursesIcon),
        },
    ],
};
