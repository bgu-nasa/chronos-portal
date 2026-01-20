/**
 * Serializer utilities to convert form data structures into backend-expected format
 */

import type { ForbiddenTimeRangeEntry, RequiredCapacityFormData } from "./constraint-value-parser";

/**
 * Serializes forbidden_timerange form entries into backend format
 * Input: [{ weekday: "Monday", startTime: "09:30", endTime: "11:00" }]
 * Output: "Monday 09:30 - 11:00"
 */
export function serializeForbiddenTimeRange(entries: ForbiddenTimeRangeEntry[]): string {
    return entries
        .filter(e => e.weekday && e.startTime && e.endTime)
        .map(e => `${e.weekday} ${e.startTime} - ${e.endTime}`)
        .join(", ");
}

/**
 * Serializes preferred_weekdays array into backend format
 * Input: ["Monday", "Wednesday", "Friday"]
 * Output: "Monday,Wednesday,Friday"
 */
export function serializePreferredWeekdays(weekdays: string[]): string {
    return weekdays.filter(Boolean).join(",");
}

/**
 * Serializes required_capacity form data into JSON string
 * Input: { min: 30, max: 50 }
 * Output: '{"min":30,"max":50}'
 */
export function serializeRequiredCapacity(data: RequiredCapacityFormData): string {
    const obj: Record<string, number> = {};
    if (data.min !== undefined && data.min !== null) {
        obj.min = data.min;
    }
    if (data.max !== undefined && data.max !== null) {
        obj.max = data.max;
    }
    return JSON.stringify(obj);
}

/**
 * Serializes array into comma-separated string
 * Input: ["Building A", "Building B"]
 * Output: "Building A,Building B"
 */
export function serializeCommaSeparated(values: string[]): string {
    return values.filter(Boolean).join(",");
}
