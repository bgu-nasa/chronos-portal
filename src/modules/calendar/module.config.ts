/** @author noamarg */
import type { ModuleConfig } from "@/infra";
import CalendarPage from "./src/pages/CalendarPage";
import React from "react";
import { CalendarIcon } from "@/common/icons";

export const moduleConfig: ModuleConfig = {
    name: "calendar",
    owner: "noamarg@post.bgu.ac.il",
    basePath: "/calendar",
    song: "https://www.youtube.com/watch?v=VdQY7BusJNU",
    routes: [
        {
            name: "calendar",
            path: "/*",
            authorize: true,
            element: React.createElement(CalendarPage),
        },
    ],
    navigationItems: [
        {
            location: "dashboard",
            label: "Calendar",
            href: "/calendar",
            icon: React.createElement(CalendarIcon),
            order: 1,
        },
    ],
};
