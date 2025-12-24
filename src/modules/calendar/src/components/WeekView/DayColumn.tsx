/** @author noamarg */
import React, { useMemo, useState, useEffect } from 'react';
import { Box } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import type { CalendarEvent } from '@/modules/calendar/src/types';
import { EventItem } from './EventItem';

import styles from './DayColumn.module.css';
import resources from './DayColumn.resources.json';

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
  dayStartHour = 8,
  hoursPerDay = 24
}) => {
  const [now, setNow] = useState(new Date());

  const interval = useInterval(() => setNow(new Date()), resources.intervals.nowUpdate);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, [interval]);

  const isToday = date.toDateString() === now.toDateString();

  // Generate grid lines
  const gridLines = useMemo(() => {
    const hours = Array.from({ length: hoursPerDay + 1 }, (_, i) => i);
    return hours.map((hour) => (
      <Box
        key={`grid-line-${hour}`}
        className={styles.gridLine}
        style={{
          top: `${hour * hourHeight}px`
        }}
      />
    ));
  }, [hoursPerDay, hourHeight]);

  // Handle current time indicator position
  let currentTimeTop = null;
  if (isToday) {
    const currentHour = now.getHours() + now.getMinutes() / 60;
    if (currentHour >= dayStartHour && currentHour <= dayStartHour + hoursPerDay) {
      currentTimeTop = (currentHour - dayStartHour) * hourHeight;
    }
  }

  const dailyEvents = useMemo(() => {
    return events.filter((e) => e.start.toDateString() === date.toDateString());
  }, [events, date]);

  // Positioning algorithm for overlapping events
  const positionedEvents = useMemo(() => {
    const sorted = [...dailyEvents].sort((a, b) => a.start.getTime() - b.start.getTime());
    const columns: CalendarEvent[][] = [];

    for (const event of sorted) {
      let placed = false;
      for (const column of columns) {
        const lastInColumn = column.at(-1);
        if (lastInColumn && event.start >= lastInColumn.end) {
          column.push(event);
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([event]);
      }
    }

    return columns.flatMap((column, colIndex) =>
      column.map((event) => ({
        ...event,
        left: (colIndex / columns.length) * 100,
        width: 100 / columns.length,
      }))
    );
  }, [dailyEvents]);

  return (
    <Box className={`${styles.dayColumn} ${isToday ? styles.todayColumn : styles.notTodayColumn}`}>
      {gridLines}

      {isToday && currentTimeTop !== null && (
        <Box
          className={styles.nowLine}
          style={{
            top: `${currentTimeTop}px`
          }}
        >
          <Box className={styles.nowDot} />
        </Box>
      )}

      {positionedEvents.map((event) => (
        <EventItem
          key={event.id}
          event={event}
          hourHeight={hourHeight}
          dayStartHour={dayStartHour}
          left={event.left}
          width={event.width}
        />
      ))}
    </Box>
  );
};
