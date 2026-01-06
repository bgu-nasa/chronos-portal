# $app Service Layer

Global singleton providing cross-cutting application services.

## Overview

The `$app` object is a singleton that hosts multiple application-level services. Currently implements HTTP client functionality with plans for future expansion.

## Architecture

```
src/infra/service/
├── app.ts                    # $app singleton export
├── index.ts                  # Public API exports
└── ajax/
    ├── types.ts              # TypeScript interfaces
    ├── token.service.ts      # Token storage & refresh logic
    ├── httpClient.ts         # Axios instance with interceptors
    └── ajax.service.ts       # Public ajax API wrapper
```

## Usage

### Basic Authenticated Requests

```ts
import { $app } from "@/infra/service";

// GET request (authenticated by default)
const user = await $app.ajax.get<User>("/users/me");

// POST request
const result = await $app.ajax.post<CreateResponse>("/items", {
    name: "New Item",
    description: "Item description",
});

// PUT request
const updated = await $app.ajax.put<User>(`/users/${id}`, userData);

// PATCH request
const patched = await $app.ajax.patch<User>(`/users/${id}`, {
    name: "New Name",
});

// DELETE request
await $app.ajax.delete(`/items/${id}`);
```

### Unauthenticated Requests

For public endpoints like login or registration:

```ts
// Login (no auth token required)
const response = await $app.ajax.post<LoginResponse>(
    "/auth/login",
    { email, password },
    { auth: false }
);

// Public data access
const data = await $app.ajax.get<PublicData>("/public/data", { auth: false });
```

## Features

### Automatic Token Management

-   Tokens are stored in-memory with localStorage backup
-   Automatic injection into authenticated requests
-   No manual token handling required

### Smart Token Refresh

-   Tokens automatically refresh 5 minutes before expiration
-   Single refresh request for concurrent calls
-   Failed refresh clears token and rejects pending requests

**Constants:**

-   `TOKEN_TTL`: 60 minutes (1 hour)
-   `REFRESH_MARGIN`: 5 minutes

### Error Normalization

All errors are normalized to a consistent shape:

```ts
interface ApiError {
    status: number; // HTTP status code (0 if network error)
    message: string; // Error message
    details?: unknown; // Optional error details from server
}
```

### Automatic 401 Handling

On `401 Unauthorized` responses:

-   Token is automatically cleared
-   User needs to re-authenticate

## Configuration

### Base URL

Set via environment variable:

```env
VITE_API_BASE_URL=https://api.example.com
```

Defaults to `/api` if not set.

### Refresh Endpoint

Default: `/auth/refresh`

Expected response:

```ts
{
    accessToken: string;
}
```

## Manual Token Management

In rare cases where manual token management is needed:

```ts
import { tokenService } from "@/infra/service";

// Set token (typically after login)
tokenService.setToken("your-access-token");

// Get current token
const token = tokenService.getToken();

// Check if token exists
const hasToken = tokenService.hasToken();

// Clear token (logout)
tokenService.clearToken();

// Check if token needs refresh
const isStale = tokenService.isTokenStale();
```

## Type Safety

All methods are fully typed using generics:

```ts
interface User {
    id: string;
    name: string;
    email: string;
}

// Response is typed as User
const user = await $app.ajax.get<User>("/users/me");

// TypeScript knows about user.name, user.email, etc.
console.log(user.name);
```

## Extensibility

The `$app` singleton is designed for future expansion:

```ts
// Future services can be added easily:
export const $app = {
    ajax: ajaxService,
    // auth: authService,
    // storage: storageService,
    // notifications: notificationService,
};
```

## Best Practices

### ✅ Do

-   Always use `$app.ajax` for HTTP requests
-   Let the system handle tokens automatically
-   Use `{ auth: false }` for public endpoints
-   Rely on type generics for response typing

### ❌ Don't

-   Don't manage tokens manually in components
-   Don't use raw `axios` or `fetch` directly
-   Don't store tokens in component state
-   Don't read from localStorage directly

## Implementation Details

### Token Storage Strategy

1. **Primary**: In-memory storage (fast, secure)
2. **Backup**: localStorage (survives page reload)
3. **Read flow**: Always read from memory, not localStorage

### Interceptor Flow

**Request Interceptor:**

1. Check if request requires auth (`auth` config option)
2. If authenticated and token is stale, refresh it
3. Wait for any in-flight refresh to complete
4. Inject `Authorization: Bearer <token>` header
5. Proceed with request

**Response Interceptor:**

1. On success, return response as-is
2. On error, normalize to `ApiError` shape
3. On `401`, clear token from memory and storage
4. Reject with normalized error

### Refresh Deduplication

Multiple concurrent requests triggering refresh will:

1. First request starts the refresh
2. Subsequent requests wait for the same promise
3. All proceed with the new token once refresh completes

## Testing Tips

### Mock $app in tests

```ts
import { $app } from "@/infra/service";

// Mock the ajax service
vi.spyOn($app.ajax, "get").mockResolvedValue(mockData);
```

### Test without auth

```ts
// Use auth: false to bypass token logic in tests
await $app.ajax.get("/test", { auth: false });
```

## Troubleshooting

### "Token refresh failed"

Check:

-   Refresh endpoint returns correct format
-   Token is valid and not expired
-   Network connectivity

### Requests fail with 401

-   Token may have been cleared due to failed refresh
-   User needs to log in again
-   Check if endpoint requires authentication

### Type errors with response

Ensure your type definition matches the API response:

```ts
// API returns: { data: { user: {...} } }
// Type should match the actual response structure
interface ApiResponse {
    data: {
        user: User;
    };
}

const response = await $app.ajax.get<ApiResponse>("/endpoint");
const user = response.data.user;
```
