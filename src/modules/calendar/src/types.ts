export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color?: string;
    description?: string;
}

export interface DayViewProps {
    date: Date;
    events: CalendarEvent[];
}
