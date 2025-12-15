/** @author aaron-iz */
import { ApplicationModuleRepository } from "./module-repository";
import type { ModuleRouteConfiguration } from "./module.types";

export class RoutesRepository {
    private loadApplicationRoutes(): ModuleRouteConfiguration[] {
        const moduleConfigs = ApplicationModuleRepository.getModules();
        return (
            moduleConfigs
                .map((mc) =>
                    mc.routes.map((route) => ({
                        ...route,
                        path: `${mc.basePath}${route.path}`, // prefix route path with module base path
                    }))
                )
                .flat() || []
        );
    }

    /**
     * @returns All the routes
     */
    getApplicationRoutes(): ModuleRouteConfiguration[] {
        return this.loadApplicationRoutes();
    }

    /**
     * @returns All the routes requiring authentication
     */
    getAuthenticatedRoutes(): ModuleRouteConfiguration[] {
        return this.loadApplicationRoutes().filter((route) => route.authorize);
    }

    /**
     * @returns All the routes not requiring authentication
     */
    getPublicRoutes(): ModuleRouteConfiguration[] {
        return this.loadApplicationRoutes().filter((route) => !route.authorize);
    }
}

export const ApplicationRoutesRepository = new RoutesRepository();
