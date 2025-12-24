/** @author noamarg */
import React, { useMemo, useState, useEffect } from 'react';
import { Box } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import type { CalendarEvent } from '@/modules/calendar/src/types';
import { EventItem } from './EventItem';

interface DayColumnProps {
  date: Date;
  events: CalendarEvent[];
  hourHeight?: number;
  dayStartHour?: number;
  hoursPerDay?: number;
}

export const DayColumn: React.FC<DayColumnProps> = ({
  date,
  events,
  hourHeight = 60,
  dayStartHour = 0,
  hoursPerDay = 24
}) => {
  const [now, setNow] = useState(new Date());

  const interval = useInterval(() => setNow(new Date()), 60000);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, []);

  const isToday = now.toDateString() === date.toDateString();

  // Generate grid lines
  const gridLines = useMemo(() => {
    const hours = Array.from({ length: hoursPerDay + 1 }, (_, i) => i);
    return hours.map((hour) => (
      <Box
        key={`grid-line-${hour}`}
        style={{
          position: 'absolute',
          top: `${hour * hourHeight}px`,
          left: 0,
          right: 0,
          height: '1px',
          backgroundColor: 'var(--mantine-color-gray-1)',
          borderBottom: '1px solid var(--mantine-color-gray-0)'
        }}
      />
    ));
  }, [hoursPerDay, hourHeight]);

  // Check if event belongs to this day
  const dayEvents = useMemo(() => {
    const filtered = events.filter(event =>
      event.start.getDate() === date.getDate() &&
      event.start.getMonth() === date.getMonth() &&
      event.start.getFullYear() === date.getFullYear()
    );

    // Sort by start time
    return filtered.sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [events, date]);

  // Overlap algorithm
  const positionedEvents = useMemo(() => {
    const results: Array<{ event: CalendarEvent; left: number; width: number }> = [];
    const columns: CalendarEvent[][] = [];

    dayEvents.forEach(event => {
      let placed = false;
      for (const column of columns) {
        const lastEventInColumn = column.at(-1);
        if (lastEventInColumn && event.start >= lastEventInColumn.end) {
          column.push(event);
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([event]);
      }
    });

    columns.forEach((column, colIndex) => {
      const width = 100 / columns.length;
      const left = colIndex * width;
      column.forEach(event => {
        results.push({ event, left, width });
      });
    });

    return results;
  }, [dayEvents]);

  const currentTimeTop = useMemo(() => {
    if (!isToday) return null;
    const hours = now.getHours() + now.getMinutes() / 60;
    return (hours - dayStartHour) * hourHeight;
  }, [isToday, now, dayStartHour, hourHeight]);

  return (
    <Box
      style={{
        position: 'relative',
        height: `${hoursPerDay * hourHeight}px`,
        flex: 1,
        borderRight: '1px solid var(--mantine-color-gray-3)',
        backgroundColor: isToday ? 'var(--mantine-color-blue-0)' : 'var(--mantine-color-body)',
        transition: 'background-color 0.3s ease',
        overflow: 'hidden'
      }}
    >
      {gridLines}

      {isToday && currentTimeTop !== null && (
        <Box
          style={{
            position: 'absolute',
            top: `${currentTimeTop}px`,
            left: 0,
            right: 0,
            height: '2px',
            backgroundColor: 'var(--mantine-color-red-6)',
            zIndex: 20,
            pointerEvents: 'none'
          }}
        >
          <Box
            style={{
              position: 'absolute',
              top: '-4px',
              left: '-5px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--mantine-color-red-6)'
            }}
          />
        </Box>
      )}

      {positionedEvents.map(({ event, left, width }) => (
        <EventItem
          key={event.id}
          event={event}
          hourHeight={hourHeight}
          dayStartHour={dayStartHour}
          left={left}
          width={width}
        />
      ))}
    </Box>
  );
};
