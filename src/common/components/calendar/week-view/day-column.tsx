/** @author noamarg */
import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { Box } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import type { CalendarEvent } from "@/common/types";
import type { TimeSelection } from './time-grid';
import { EventItem } from './event-item';

import styles from './day-column.module.css';
import resources from './day-column.resources.json';

interface DayColumnProps {
  date: Date;
  events: CalendarEvent[];
  hourHeight?: number;
  dayStartHour?: number;
  hoursPerDay?: number;
  selection?: TimeSelection | null;
  isSelecting?: boolean;
  onSelectionStart?: (date: Date, hour: number) => void;
  onSelectionMove?: (hour: number) => void;
  onSelectionEnd?: () => void;
}

export const DayColumn: React.FC<DayColumnProps> = ({
  date,
  events,
  hourHeight = 60,
  dayStartHour = 8,
  hoursPerDay = 24,
  selection,
  isSelecting,
  onSelectionStart,
  onSelectionMove,
  onSelectionEnd
}) => {
  const [now, setNow] = useState(new Date());
  const columnRef = useRef<HTMLDivElement>(null);

  const interval = useInterval(() => setNow(new Date()), resources.intervals.nowUpdate);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, [interval]);

  const isToday = date.toDateString() === now.toDateString();

  const snapToInterval = useCallback((hour: number) => {
    // Snap to 30-minute intervals (0.5 hour increments)
    return Math.round(hour * 2) / 2;
  }, []);

  const getHourFromY = useCallback((y: number) => {
    if (!columnRef.current) return 0;
    const rect = columnRef.current.getBoundingClientRect();
    const relativeY = y - rect.top;
    const hour = dayStartHour + (relativeY / hourHeight);
    const clampedHour = Math.max(dayStartHour, Math.min(dayStartHour + hoursPerDay, hour));
    return snapToInterval(clampedHour);
  }, [dayStartHour, hourHeight, hoursPerDay, snapToInterval]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (onSelectionStart) {
      const hour = getHourFromY(e.clientY);
      onSelectionStart(date, hour);
    }
  }, [date, getHourFromY, onSelectionStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isSelecting && onSelectionMove) {
      const hour = getHourFromY(e.clientY);
      onSelectionMove(hour);
    }
  }, [isSelecting, getHourFromY, onSelectionMove]);

  const handleMouseUp = useCallback(() => {
    if (isSelecting && onSelectionEnd) {
      onSelectionEnd();
    }
  }, [isSelecting, onSelectionEnd]);

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

  // Calculate selection overlay position
  const selectionOverlay = useMemo(() => {
    if (!selection) return null;

    const startHour = Math.min(selection.startHour, selection.endHour);
    const endHour = Math.max(selection.startHour, selection.endHour);
    const top = (startHour - dayStartHour) * hourHeight;
    const height = (endHour - startHour) * hourHeight;

    return { top, height };
  }, [selection, dayStartHour, hourHeight]);

  return (
    <Box
      ref={columnRef}
      className={`${styles.dayColumn} ${isToday ? styles.todayColumn : styles.notTodayColumn}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isSelecting ? 'ns-resize' : 'default' }}
    >
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

      {selectionOverlay && (
        <Box
          className={styles.selectionOverlay}
          style={{
            top: `${selectionOverlay.top}px`,
            height: `${selectionOverlay.height}px`,
            position: 'absolute',
            left: 0,
            right: 0,
            backgroundColor: 'var(--mantine-color-blue-1)',
            border: '2px solid var(--mantine-color-blue-5)',
            borderRadius: '4px',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
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
