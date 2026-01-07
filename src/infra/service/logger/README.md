# Logger Service

Custom logger service that collects logs in a queue and periodically sends them to Discord via webhook.

## Features

-   **Queue-based logging**: Logs are collected in memory and sent in batches
-   **Non-blocking**: Runs in the background without affecting UI performance
-   **Discord integration**: Sends logs to Discord via webhook every 3 seconds
-   **Console.log replacement**: Implements the same interface as console methods
-   **Automatic flushing**: Flushes logs periodically and on page unload
-   **Plain text format**: Simple, readable log format
-   **Organization tracking**: Automatically includes organization ID when available

## Setup

Add the Discord webhook URL to your environment variables:

```env
VITE_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
```

## Usage

Access the logger through the `$app` service:

```typescript
import { $app } from "@/infra/service";

// Basic logging
$app.logger.log("Application started");
$app.logger.info("User logged in");
$app.logger.warn("Deprecated feature used");
$app.logger.error("Failed to load data");
$app.logger.debug("Debug information");

// Logging with additional data
$app.logger.info("User action", { userId: 123, action: "click" });
$app.logger.error("API Error", {
    status: 500,
    message: "Internal server error",
});

// Multiple arguments
$app.logger.info("Processing items", items, metadata, timestamp);

// Manual flush (usually not needed)
await $app.logger.flush();
```

## How It Works

1. **Log Collection**: When you call `$app.logger.log()`, `info()`, `warn()`, `error()`, or `debug()`, the log entry is added to an in-memory queue
2. **Periodic Flushing**: Every 3 seconds, if the queue is not empty, all logs are sent to Discord
3. **Non-blocking**: The flushing happens asynchronously and won't block the UI
4. **Automatic Cleanup**: On page unload, any remaining logs are flushed

## Discord Output Format

Logs are sent as plain text messages with the format:

```
[LEVEL][timestamp][orgid:id] message | additional data
```

### Example Output

```
[INFO ][2026-01-07T00:10:15.123Z][orgid:org_abc123] User logged in | {"userId":123}
[ERROR][2026-01-07T00:10:16.456Z][orgid:org_abc123] API request failed | {"status":500,"message":"Internal server error"}
[WARN ][2026-01-07T00:10:17.789Z][orgid:org_abc123] Deprecated feature used
[DEBUG][2026-01-07T00:10:18.012Z][orgid:org_abc123] Processing complete | {"items":25,"duration":150}
```

Each log is on a separate line for easy reading. Additional data is automatically stringified and appended with a `|` separator.

## Configuration

To change the flush interval, modify the `flushInterval` property in [`logger.service.ts`](./logger.service.ts:28):

```typescript
private readonly flushInterval: number = 3000; // milliseconds
```

## Error Handling

If sending logs to Discord fails:

-   Logs are kept in the queue for the next attempt
-   Errors are logged to the console as fallback
-   The application continues to function normally

## Performance

-   **Memory efficient**: Logs are cleared after successful sending
-   **Non-blocking**: Uses `setInterval` and async/await for non-blocking operation
-   **Batched sending**: Multiple logs sent in one request
-   **Rate limiting friendly**: Automatic delays between messages if splitting is needed

## Notes

-   If `VITE_DISCORD_WEBHOOK_URL` is not set, logs are silently queued but not sent
-   Do **not** use `console.log()` directly - always use `$app.logger` instead
-   The logger automatically cleans up on page unload
-   Organization ID is automatically included when available via `$app.organization`
