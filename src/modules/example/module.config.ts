import type { ModuleConfig } from "@/infra";
import React from "react";
import { ExampleDashboardPage, ExamplePage } from "./src/pages";

export const moduleConfig: ModuleConfig = {
    name: "Example Module",
    owner: "aaroni@post.bgu.ac.il",
    basePath: "/example",
    song: "https://www.youtube.com/watch?v=PKQPey6L42M",
    routes: [
        {
            name: "example-page",
            path: "", // Route will be /example
            element: React.createElement(ExamplePage),
        },
        {
            name: "example-dashboard-page",
            path: "dashboard", // Route will be /example/dashboard
            element: React.createElement(ExampleDashboardPage),
            authorize: true,
        },
    ],
    navigationItems: [],
};
