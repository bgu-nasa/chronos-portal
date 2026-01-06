# Organization Service

The organization service provides global state management for organization information (TenantContext) using Zustand. This service is automatically initialized when a user enters the dashboard and provides convenient access to organization data, user roles, and departments.

## Overview

The organization information is fetched automatically when the dashboard layout mounts and is available throughout the application via multiple access patterns.

## API Endpoint

The service calls: `GET /api/management/organization/info`

This endpoint returns the `OrganizationInformation` object containing:

-   Organization details (id, name, deleted status)
-   User roles for the current user
-   Departments

## Usage Patterns

### 1. Using the React Hook (Recommended for Components)

```tsx
import { useOrganization } from "@/infra/service";

function MyComponent() {
    const {
        organization,
        isLoading,
        error,
        fetchOrganization,
        hasRole,
        isAdministrator,
        getActiveDepartments,
    } = useOrganization();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!organization) return <div>No organization</div>;

    return (
        <div>
            <h1>{organization.name}</h1>
            {isAdministrator() && <AdminPanel />}
            <DepartmentList departments={getActiveDepartments()} />
        </div>
    );
}
```

### 2. Using the Service Directly (Outside React Components)

```typescript
import { $app } from "@/infra/service";

// Get organization
const org = $app.organization.getOrganization();

// Check roles
if ($app.organization.isAdministrator()) {
    console.log("User is admin");
}

// Get departments
const departments = $app.organization.getActiveDepartments();

// Fetch organization (if needed)
await $app.organization.fetchOrganization();
```

### 3. Using the Store Directly (Advanced)

```typescript
import { useOrganizationStore } from "@/infra/service";

function MyComponent() {
    // Subscribe to specific state slices
    const orgName = useOrganizationStore((state) => state.organization?.name);
    const isLoading = useOrganizationStore((state) => state.isLoading);

    return <div>{orgName}</div>;
}
```

## Available Methods

### Service Methods (`$app.organization` or `useOrganization()`)

-   **`getOrganization()`**: Get current organization information
-   **`isLoading()`**: Check if data is loading
-   **`getError()`**: Get current error state
-   **`fetchOrganization()`**: Manually fetch organization info from API
-   **`clearOrganization()`**: Clear organization state (called on logout)
-   **`getUserRoles()`**: Get all user roles for current organization
-   **`getActiveDepartments()`**: Get non-deleted departments
-   **`hasRole(role)`**: Check if user has specific role
-   **`isAdministrator()`**: Check if user is administrator
-   **`isUserManager()`**: Check if user is user manager
-   **`isResourceManager()`**: Check if user is resource manager
-   **`isManager()`**: Check if user has any management role

## Role Types

```typescript
import { RoleType } from "@/infra/service";

const roles = {
    Administrator: RoleType.Administrator,
    UserManager: RoleType.UserManager,
    ResourceManager: RoleType.ResourceManager,
    Operator: RoleType.Operator,
    Viewer: RoleType.Viewer,
};
```

## Type Definitions

```typescript
interface OrganizationInformation {
    id: string;
    name: string;
    deleted: boolean;
    deletedTime: string;
    userRoles: RoleAssignmentResponse[];
    departments: DepartmentResponse[];
}

interface RoleAssignmentResponse {
    id: string;
    userId: string;
    organizationId: string;
    departmentId: string | null;
    role: RoleType;
}

interface DepartmentResponse {
    id: string;
    name: string;
    deleted: boolean;
}
```

## Examples

### Role-Based Rendering

```tsx
import { useOrganization, RoleType } from "@/infra/service";

function AdminOnlyFeature() {
    const { hasRole } = useOrganization();

    if (!hasRole(RoleType.Administrator)) {
        return null;
    }

    return <div>Admin-only content</div>;
}
```

### Department Selector

```tsx
import { useOrganization } from "@/infra/service";

function DepartmentSelector() {
    const { getActiveDepartments } = useOrganization();
    const departments = getActiveDepartments();

    return (
        <select>
            {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                    {dept.name}
                </option>
            ))}
        </select>
    );
}
```

### Manual Refresh

```tsx
import { useOrganization } from "@/infra/service";

function RefreshButton() {
    const { fetchOrganization, isLoading } = useOrganization();

    const handleRefresh = async () => {
        try {
            await fetchOrganization();
        } catch (error) {
            console.error("Failed to refresh organization:", error);
        }
    };

    return (
        <button onClick={handleRefresh} disabled={isLoading}>
            Refresh
        </button>
    );
}
```

## Lifecycle

1. **Initial Load**: Organization data is automatically fetched when the dashboard layout mounts
2. **Persistence**: Data persists in memory throughout the session via Zustand
3. **Logout**: Organization data is automatically cleared when user logs out

## Notes

-   Organization data is fetched only once per session (unless manually refreshed)
-   The service handles loading and error states automatically
-   All API calls are authenticated via the token service
-   The store is global and shared across all components
