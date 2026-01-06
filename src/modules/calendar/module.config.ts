/** @author noamarg */
import type { ModuleConfig } from "@/infra";
import CalendarPage from "./src/pages/CalendarPage";
import React from "react";

export const moduleConfig: ModuleConfig = {
    name: "calendar",
    owner: "noamarg@post.bgu.ac.il",
    basePath: "/calendar",
    song: "https://www.youtube.com/watch?v=VdQY7BusJNU",
    routes: [
        {
            name: "calendar",
            path: "/",
            authorize: true,
            element: React.createElement(CalendarPage),
        },
    ],
    navigationItems: [
        // {
        //   label: "Calendar",
        //   href: "/calendar",
        //   location: "dashboard",
        // }
    ],
};
