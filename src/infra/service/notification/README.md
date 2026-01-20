# Notification Service

A global notification system integrated with the `$app` service that displays Mantine notifications at the bottom right of the screen.

## Features

- **Ephemeral notifications** - All notifications are stored in memory only and never persisted
- **Auto-dismiss** - Notifications automatically disappear after 15 seconds (configurable)
- **Multiple types** - Success, error, warning, loading, and info notifications
- **Positioned bottom-right** - Consistent placement across the application
- **Zustand state management** - Lightweight and efficient state handling

## Usage

### Basic Examples

```typescript
import { $app } from "@/infra/service";

// Success notification
$app.notifications.showSuccess(
    "Task completed",
    "Your changes have been saved",
);

// Error notification
$app.notifications.showError("Operation failed", "Unable to save changes");

// Warning notification
$app.notifications.showWarning("Warning", "This action cannot be undone");

// Loading notification (doesn't auto-close by default)
const loadingId = $app.notifications.showLoading(
    "Processing",
    "Please wait...",
);

// Info notification
$app.notifications.showInfo("Information", "Here is some useful information");
```

### Advanced Options

```typescript
// Custom duration (in milliseconds)
$app.notifications.showSuccess(
    'Success',
    'Operation completed',
    { duration: 5000 } // 5 seconds
);

// Prevent auto-close
$app.notifications.showError(
    'Critical Error',
    'This requires your attention',
    { autoClose: false }
);

// Custom ID for updating/removing specific notifications
const notificationId = $app.notifications.showLoading(
    'Uploading',
    'File upload in progress...',
    { id: 'upload-notification' }
);

// Later, remove it manually
$app.notifications.remove(notificationId);

// Custom color and icon
$app.notifications.showInfo(
    'Custom Notification',
    'With custom styling',
    {
        color: 'violet',
        icon: <CustomIcon />,
    }
);

// Disable close button
$app.notifications.showWarning(
    'Important',
    'Please read this carefully',
    { withCloseButton: false }
);
```

### Managing Notifications

```typescript
// Remove a specific notification by ID
$app.notifications.remove("notification-id");

// Clear all notifications
$app.notifications.clear();
```

## API Reference

### `showSuccess(title, message?, options?): string`

Display a success notification with a green checkmark icon.

### `showError(title, message?, options?): string`

Display an error notification with a red X icon.

### `showWarning(title, message?, options?): string`

Display a warning notification with a yellow warning icon.

### `showLoading(title, message?, options?): string`

Display a loading notification with a spinning loader icon. **Does not auto-close by default.**

### `showInfo(title, message?, options?): string`

Display an info notification with a blue info icon.

### `remove(id: string): void`

Remove a specific notification by its ID.

### `clear(): void`

Remove all active notifications.

## Notification Options

All notification methods accept an optional `options` parameter:

```typescript
interface NotificationOptions {
    /** Duration in milliseconds (default: 15000) */
    duration?: number;

    /** Whether to auto-close (default: true, except for loading) */
    autoClose?: boolean;

    /** Custom ID for the notification */
    id?: string;

    /** Whether to show loading indicator */
    loading?: boolean;

    /** Custom icon component */
    icon?: React.ReactNode;

    /** Custom color */
    color?: string;

    /** Show close button (default: true) */
    withCloseButton?: boolean;
}
```

## Integration

The notification system is automatically integrated into the application:

1. **Service** - Available globally via `$app.notifications`
2. **Provider** - Included in the main `App.tsx` component
3. **State** - Managed by Zustand store (`useNotificationStore`)

No additional setup required - just import `$app` and start showing notifications!

## Examples in Context

### Form Submission

```typescript
const handleSubmit = async (data) => {
    try {
        await saveData(data);
        $app.notifications.showSuccess(
            "Saved",
            "Your data has been saved successfully",
        );
    } catch (error) {
        $app.notifications.showError("Error", error.message);
    }
};
```

### Async Operations

```typescript
const handleDelete = async (id) => {
    const loadingId = $app.notifications.showLoading(
        "Deleting",
        "Please wait...",
    );

    try {
        await deleteItem(id);
        $app.notifications.remove(loadingId);
        $app.notifications.showSuccess("Deleted", "Item removed successfully");
    } catch (error) {
        $app.notifications.remove(loadingId);
        $app.notifications.showError("Failed", "Unable to delete item");
    }
};
```
