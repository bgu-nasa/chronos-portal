/** @author noamarg */
import type { ModuleConfig } from "@/infra";
import CalendarPage from "./src/pages/CalendarPage";
import React from "react";
import { WeekView } from "./src/components";
import { EventDetailsModal } from "./src/components/WeekView/EventDetailsModal";
import { MOCK_ACADEMIC_SCHEDULE } from "./.mock";

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
            element: React.createElement(
                CalendarPage,
                null,
                React.createElement(WeekView, { events: MOCK_ACADEMIC_SCHEDULE }),
            ),
        },
        {
            name: "calendar-event",
            path: "/event/:id",
            authorize: true,
            element: React.createElement(
                CalendarPage,
                null,
                React.createElement(
                    React.Fragment,
                    null,
                    React.createElement(WeekView, { events: MOCK_ACADEMIC_SCHEDULE }),
                    React.createElement(EventDetailsModal),
                ),
            ),
        },
    ],
    navigationItems: [],
};
