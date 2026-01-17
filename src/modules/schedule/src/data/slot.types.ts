/**
 * Slot Types
 * Definitions for Slot API responses and requests
 */

/**
 * Weekday type and constants
 * Matches backend WeekDays enum: Monday=0, Tuesday=1, ... Sunday=6
 */
export const Weekday = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6
} as const;

export type Weekday = typeof Weekday[keyof typeof Weekday];

/**
 * Map from weekday number to display name
 */
export const WeekdayNames: Record<Weekday, string> = {
    [Weekday.Monday]: "Monday",
    [Weekday.Tuesday]: "Tuesday",
    [Weekday.Wednesday]: "Wednesday",
    [Weekday.Thursday]: "Thursday",
    [Weekday.Friday]: "Friday",
    [Weekday.Saturday]: "Saturday",
    [Weekday.Sunday]: "Sunday"
};

/**
 * Map from string weekday name to number (for parsing backend responses)
 */
export const WeekdayFromString: Record<string, Weekday> = {
    "Monday": Weekday.Monday,
    "Tuesday": Weekday.Tuesday,
    "Wednesday": Weekday.Wednesday,
    "Thursday": Weekday.Thursday,
    "Friday": Weekday.Friday,
    "Saturday": Weekday.Saturday,
    "Sunday": Weekday.Sunday
};

/**
 * Slot Response Interface
 */
export interface SlotResponse {
    id: string;
    organizationId: string;
    schedulingPeriodId: string;
    weekday: Weekday | string;  // Can be number or string from backend
    fromTime: string;
    toTime: string;
}

/**
 * Create Slot Request Interface
 */
export interface CreateSlotRequest {
    schedulingPeriodId: string;
    weekday: Weekday;
    fromTime: string;
    toTime: string;
}

/**
 * Update Slot Request Interface
 */
export interface UpdateSlotRequest {
    weekday: Weekday;
    fromTime: string;
    toTime: string;
}

/**
 * Helper to get weekday name from response (handles both string and number)
 */
export function getWeekdayName(weekday: Weekday | string): string {
    if (typeof weekday === "string") {
        return weekday;  // Already a string name
    }
    return WeekdayNames[weekday] || "Unknown";
}
