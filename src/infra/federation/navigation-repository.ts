/** @author aaron-iz */
import { ApplicationModuleRepository } from "./module-repository";
import type { NavigationItem } from "./module.types";

export class NavigationRepository {
    private loadNavigationItems(): NavigationItem[] {
        const moduleConfigs = ApplicationModuleRepository.getModules();
        return moduleConfigs.flatMap((mc) => mc.navigationItems) || [];
    }

    /**
     * @returns All navigation items from all modules
     */
    getAllNavigationItems(): NavigationItem[] {
        return this.loadNavigationItems();
    }

    /**
     * @param location - The location to filter by
     * @returns Navigation items for a specific location
     */
    getNavigationItemsByLocation(
        location: "dashboard" | "public" | "admin"
    ): NavigationItem[] {
        return this.loadNavigationItems().filter(
            (item) => item.location === location
        );
    }

    /**
     * @returns Navigation items for the dashboard
     */
    getDashboardNavigationItems(): NavigationItem[] {
        return this.getNavigationItemsByLocation("dashboard");
    }

    /**
     * @returns Navigation items for public pages
     */
    getPublicNavigationItems(): NavigationItem[] {
        return this.getNavigationItemsByLocation("public");
    }

    /**
     * @returns Navigation items for admin pages
     */
    getAdminNavigationItems(): NavigationItem[] {
        return this.getNavigationItemsByLocation("admin");
    }
}

export const ApplicationNavigationRepository = new NavigationRepository();
