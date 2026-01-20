/** @author aaron-iz */
import type { NavigationItem, RoleType } from "@/infra/federation/module.types";
import type { RoleAssignmentResponse } from "@/infra/service";

/**
 * Filters navigation items based on the user's roles.
 * Only applicable for dashboard navigation items.
 *
 * @param navigationItems - The navigation items to filter
 * @param userRoles - The user's role assignments
 * @returns Filtered navigation items that the user has permission to see
 *
 * @description
 * - If a navigation item has no `requiredRoles` field or it's empty, it's visible to all users
 * - If a navigation item has `requiredRoles`, the user must have at least one matching role
 * - Recursively filters children navigation items
 * - Parent items with no href are only visible if they have visible children
 */
export function filterNavigationByRoles(
    navigationItems: NavigationItem[],
    userRoles: RoleAssignmentResponse[],
): NavigationItem[] {
    const userRoleTypes = new Set<RoleType>(
        userRoles.map((r) => r.role as RoleType),
    );

    const filtered: NavigationItem[] = [];

    for (const item of navigationItems) {
        // Recursively filter children first
        const filteredChildren = item.children
            ? filterNavigationByRoles(item.children, userRoles)
            : item.children;

        // Check if the current item should be visible based on roles
        const isVisibleByRole =
            !item.requiredRoles ||
            item.requiredRoles.length === 0 ||
            item.requiredRoles.some((role) => userRoleTypes.has(role));

        // Determine if item should be shown:
        // 1. If item has an href, it must match role requirements
        // 2. If item has no href (parent-only), it's shown only if it has visible children
        const hasVisibleChildren =
            filteredChildren && filteredChildren.length > 0;
        const shouldShow = item.href ? isVisibleByRole : hasVisibleChildren;

        if (shouldShow) {
            // Return the item with filtered children
            filtered.push({
                ...item,
                children: filteredChildren,
            });
        }
    }

    return filtered;
}
