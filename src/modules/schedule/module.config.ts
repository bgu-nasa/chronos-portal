import type { ModuleConfig } from "@/infra";
import React from "react";
import { EventDetailsModal, WeekView } from "@/common/components/calendar";
import { CalendarIcon, ScheduleIcon, SchedulingPeriodsIcon } from "@/common/icons";
import { CalendarPage, SchedulingPeriodsPage } from "./src";

export const moduleConfig: ModuleConfig = {
    name: "Schedule",
    owner: "adamram@post.bgu.ac.il",
    basePath: "/schedule",
    routes: [
        {
            authorize: true,
            name: "scheduling-periods",
            path: "/scheduling-periods",
            element: React.createElement(SchedulingPeriodsPage),
        },
        {
            name: "calendar",
            path: "/calendar",
            authorize: true,
            element: React.createElement(
                CalendarPage,
                null,
                React.createElement(WeekView, { events: [] }),
            ),
        },
        {
            name: "calendar-event",
            path: "/calendar/event/:id",
            authorize: true,
            element: React.createElement(
                CalendarPage,
                null,
                React.createElement(
                    React.Fragment,
                    null,
                    React.createElement(WeekView, { events: [] }),
                    React.createElement(EventDetailsModal),
                ),
            ),
        },
    ],
    navigationItems: [
        {
            label: "Schedule",
            location: "dashboard",
            icon: React.createElement(ScheduleIcon),
            children: [
                {
                    label: "Calendar",
                    href: "/schedule/calendar",
                    location: "dashboard",
                    icon: React.createElement(CalendarIcon),
                },
                {
                    label: "Scheduling Periods",
                    href: "/schedule/scheduling-periods",
                    location: "dashboard",
                    icon: React.createElement(SchedulingPeriodsIcon),
                },
            ],
        },
    ],
};
