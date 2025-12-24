/** @author noamarg */
import type { CalendarEvent } from '@/modules/calendar/src/types';

// Helper to get dates for the current week
const getDayThisWeek = (dayIndex: number, hour: number, minute: number = 0) => {
  const date = new Date();
  const currentDay = date.getDay(); // 0 is Sunday
  const diff = dayIndex - currentDay;
  const targetDate = new Date(date.setDate(date.getDate() + diff));
  targetDate.setHours(hour, minute, 0, 0);
  return targetDate;
};

export const MOCK_ACADEMIC_SCHEDULE: CalendarEvent[] = [
  {
    id: 'lec-1',
    title: 'Intro to CS - Lecture',
    start: getDayThisWeek(1, 10, 0), // Monday 10:00
    end: getDayThisWeek(1, 12, 0), // Monday 12:00
    color: 'blue',
    description: 'Location: Auditorium Room 101. Intro to Binary and Logic Gates.'
  },
  {
    id: 'office-1',
    title: 'Office Hours',
    start: getDayThisWeek(1, 14, 0), // Monday 14:00
    end: getDayThisWeek(1, 15, 0), // Monday 15:00
    color: 'green',
    description: 'Location: Faculty Building - Room 205.'
  },
  {
    id: 'lab-1',
    title: 'Algorithms Lab',
    start: getDayThisWeek(2, 11, 0), // Tuesday 11:00
    end: getDayThisWeek(2, 13, 0), // Tuesday 13:00
    color: 'orange',
    description: 'Location: Computer Lab 3. Sorting Algorithms Implementation.'
  },
  {
    id: 'ta-1',
    title: 'TA Coordination',
    start: getDayThisWeek(3, 9, 0), // Wednesday 09:00
    end: getDayThisWeek(3, 10, 30), // Wednesday 10:30
    color: 'violet',
    description: 'Location: Meeting Room A. Grading criteria for Assignment 2.'
  },
  {
    id: 'lec-2',
    title: 'Intro to CS - Lecture',
    start: getDayThisWeek(3, 14, 0), // Wednesday 14:00
    end: getDayThisWeek(3, 16, 0), // Wednesday 16:00
    color: 'blue',
    description: 'Location: Auditorium Room 101. Continuing from Monday.'
  },
  {
    id: 'research-1',
    title: 'Research Seminar',
    start: getDayThisWeek(4, 13, 0), // Thursday 13:00
    end: getDayThisWeek(4, 15, 0), // Thursday 15:00
    color: 'cyan',
    description: 'Location: Conference Room C. Presentation of new paper results.'
  },
  {
    id: 'office-2',
    title: 'Office Hours',
    start: getDayThisWeek(5, 10, 0), // Friday 10:00
    end: getDayThisWeek(5, 11, 0), // Friday 11:00
    color: 'green',
    description: 'Location: Faculty Building - Room 205.'
  }
];
