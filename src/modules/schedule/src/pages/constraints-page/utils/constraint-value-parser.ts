/**
 * Parser utilities to convert backend constraint values into form data structures
 */

export interface ForbiddenTimeRangeEntry {
    weekday: string;
    startTime: string;
    endTime: string;
}

export interface RequiredCapacityFormData {
    min?: number;
    max?: number;
}

/**
 * Parses forbidden_timerange value into form entries
 * Input: "Monday 09:30 - 11:00, Tuesday 13:00 - 15:00"
 * Output: Array of { weekday, startTime, endTime }
 */
export function parseForbiddenTimeRange(value: string): ForbiddenTimeRangeEntry[] {
    if (!value?.trim()) {
        return [];
    }

    const entries: ForbiddenTimeRangeEntry[] = [];
    const parts = value.split(/[,\n\r]/).map(p => p.trim()).filter(Boolean);
    const pattern = /^(\w+)\s+(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/i;

    for (const part of parts) {
        const match = pattern.exec(part);
        if (match) {
            const weekday = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
            entries.push({
                weekday,
                startTime: match[2],
                endTime: match[3],
            });
        }
    }

    return entries;
}

/**
 * Parses preferred_weekdays value into array of weekday strings
 * Input: "Monday,Wednesday,Friday"
 * Output: ["Monday", "Wednesday", "Friday"]
 */
export function parsePreferredWeekdays(value: string): string[] {
    if (!value?.trim()) {
        return [];
    }

    const weekdays = new Set(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
    const entries = value.split(',').map(e => e.trim()).filter(Boolean);

    return entries.map(entry => {
        const normalized = entry.charAt(0).toUpperCase() + entry.slice(1).toLowerCase();
        return weekdays.has(normalized) ? normalized : entry;
    });
}

/**
 * Parses required_capacity JSON value into form data
 * Input: '{"min": 30, "max": 50}'
 * Output: { min: 30, max: 50 }
 */
export function parseRequiredCapacity(value: string): RequiredCapacityFormData {
    if (!value?.trim()) {
        return {};
    }

    try {
        const parsed = JSON.parse(value);
        return {
            min: parsed.min === undefined ? undefined : Number(parsed.min),
            max: parsed.max === undefined ? undefined : Number(parsed.max),
        };
    } catch {
        return {};
    }
}

/**
 * Parses comma-separated string into array
 * Input: "Building A,Building B"
 * Output: ["Building A", "Building B"]
 */
export function parseCommaSeparated(value: string): string[] {
    if (!value?.trim()) {
        return [];
    }

    return value.split(',').map(e => e.trim()).filter(Boolean);
}
