/**
 * Slot Types
 * Definitions for Slot API responses and requests
 */

/**
 * Weekday constants with string values
 * The value IS the display string, no need for separate mapping
 */
export const Weekday = {
    Sunday: "Sunday",
    Monday: "Monday",
    Tuesday: "Tuesday",
    Wednesday: "Wednesday",
    Thursday: "Thursday",
    Friday: "Friday",
    Saturday: "Saturday"
} as const;

export type Weekday = typeof Weekday[keyof typeof Weekday];

/**
 * Array of weekdays in order (Sunday first)
 */
export const WeekdayOrder: Weekday[] = [
    Weekday.Sunday,
    Weekday.Monday,
    Weekday.Tuesday,
    Weekday.Wednesday,
    Weekday.Thursday,
    Weekday.Friday,
    Weekday.Saturday
];

/**
 * Slot Response Interface
 */
export interface SlotResponse {
    id: string;
    organizationId: string;
    schedulingPeriodId: string;
    weekday: Weekday;
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
