import type { ModuleConfig } from "@/infra";
import { HomePage } from "./src";
import React from "react";

export const moduleConfig: ModuleConfig = {
    name: "Home",
    owner: "aaroni@post.bgu.ac.il",
    basePath: "/",
    routes: [
        // Use two route mappings to the same page
        {
            path: "",
            name: "Home Page",
            element: React.createElement(HomePage),
        },
        {
            path: "/home",
            name: "Home Page",
            element: React.createElement(HomePage),
        },
    ],
    navigationItems: [
        {
            location: "public",
            label: "Home",
            href: "/",
        },
    ],
};
