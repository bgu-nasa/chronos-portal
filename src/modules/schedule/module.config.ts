import type { ModuleConfig } from "@/infra";
import React from "react";
import { ScheduleIcon, SchedulingPeriodsIcon } from "@/common/icons";
import { SchedulingPeriodsPage } from "./src";

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
    ],
    navigationItems: [
        {
            label: "Schedule",
            location: "dashboard",
            icon: React.createElement(ScheduleIcon),
            children: [
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
