/** @author aaron-iz */
import type { ModuleConfig } from "./module.types";

/**
 * Dynamically discovers and loads all module configurations from the modules directory.
 * Scans for module.config.ts files under /modules and collects their moduleConfig exports.
 *
 * @returns An array of all discovered module configurations
 */
export async function discoverModules(): Promise<ModuleConfig[]> {
    const modules: ModuleConfig[] = [];

    // Use Vite's glob import to find all module.config.ts files
    // The eager: true option loads all modules immediately
    const moduleFiles = import.meta.glob<{ moduleConfig: ModuleConfig }>(
        "@/modules/**/module.config.ts",
        { eager: true }
    );

    // Extract moduleConfig from each discovered file
    for (const [path, module] of Object.entries(moduleFiles)) {
        if (module.moduleConfig) {
            modules.push(module.moduleConfig);
        } else {
            console.warn(`Module at ${path} does not export a moduleConfig`);
        }
    }

    return modules;
}

/**
 * Synchronously discovers and loads all module configurations.
 * This is a convenience wrapper around discoverModules() for synchronous contexts.
 *
 * @returns An array of all discovered module configurations
 */
export function discoverModulesSync(): ModuleConfig[] {
    const modules: ModuleConfig[] = [];

    // Use Vite's glob import with eager loading for synchronous access
    const moduleFiles = import.meta.glob<{ moduleConfig: ModuleConfig }>(
        "@/modules/**/module.config.ts",
        { eager: true }
    );

    // Extract moduleConfig from each discovered file
    for (const [path, module] of Object.entries(moduleFiles)) {
        if (module.moduleConfig) {
            modules.push(module.moduleConfig);
        } else {
            console.warn(`Module at ${path} does not export a moduleConfig`);
        }
    }

    return modules;
}
