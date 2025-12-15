/** @author aaron-iz */
import { discoverModulesSync } from "./module-discovery";
import type { ModuleConfig } from "./module.types";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export class ModuleRepository {
    private _cachedModules?: ModuleConfig[] = undefined;
    private _lastLoadTime?: Date = undefined;

    private loadModules() {
        this._cachedModules = discoverModulesSync();
        this._lastLoadTime = new Date();
    }

    private isCacheValid(): boolean {
        return (
            this._cachedModules !== undefined &&
            this._lastLoadTime !== undefined &&
            new Date().getTime() - this._lastLoadTime.getTime() < CACHE_TTL_MS
        );
    }

    private ensureModulesLoaded() {
        if (!this.isCacheValid()) {
            this.loadModules();
        }
    }

    /**
     * @returns All discovered module configurations
     */
    getModules(): ModuleConfig[] {
        this.ensureModulesLoaded();
        return this._cachedModules!;
    }

    /**
     * Find a module by its name
     * @param name - The name of the module to find
     * @returns The module configuration or undefined if not found
     */
    getModuleByName(name: string): ModuleConfig | undefined {
        this.ensureModulesLoaded();
        return this._cachedModules!.find((m) => m.name === name);
    }

    /**
     * Find a module by its base path
     * @param basePath - The base path of the module to find
     * @returns The module configuration or undefined if not found
     */
    getModuleByBasePath(basePath: string): ModuleConfig | undefined {
        this.ensureModulesLoaded();
        return this._cachedModules!.find((m) => m.basePath === basePath);
    }
}

export const ApplicationModuleRepository = new ModuleRepository();
