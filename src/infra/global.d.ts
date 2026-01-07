/**
 * Global type declarations
 * Makes $app available globally on the window object
 */

import type { $app } from "./service/app";

declare global {
    interface Window {
        $app: typeof $app;
    }

    // Make $app available as a global variable
    const $app: typeof import("./service/app").$app;
}

export {};
