/** @author noamarg */
import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { Box } from '@mantine/core';
import { useInterval } from '@mantine/hooks';

import type { CalendarEvent } from "@/common/types";

import { EventItem } from './event-item';
import styles from './day-column.module.css';
import resources from './day-column.resources.json';

interface TimeRangeSelection {
  startTime: number; // minutes from dayStartHour
  endTime: number; // minutes from dayStartHour
}

interface DayColumnProps {
  date: Date;
  events: CalendarEvent[];
  hourHeight?: number;
  dayStartHour?: number;
  hoursPerDay?: number;
  onTimeRangeSelect?: (selection: { date: Date; startTime: string; endTime: string }) => void;
}

export const DayColumn: React.FC<DayColumnProps> = ({
  date,
  events,
  hourHeight = 60,
  dayStartHour = 8,
  hoursPerDay = 24,
  onTimeRangeSelect
}) => {
  const [now, setNow] = useState(new Date());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState<TimeRangeSelection | null>(null);
  const originalStartTimeRef = useRef<number | null>(null);
  const currentEndTimeRef = useRef<number | null>(null);
  const columnRef = useRef<HTMLDivElement>(null);

  const interval = useInterval(() => setNow(new Date()), resources.intervals.nowUpdate);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, [interval]);

  const isToday = date.toDateString() === now.toDateString();

  // Snap time to nearest 30-minute interval
  const snapToHalfHour = useCallback((minutes: number): number => {
    return Math.round(minutes / 30) * 30;
  }, []);

  // Convert Y position to time in minutes from dayStartHour
  const getTimeFromY = useCallback((y: number): number => {
    const minutes = (y / hourHeight) * 60;
    return Math.max(0, Math.min(hoursPerDay * 60, snapToHalfHour(minutes)));
  }, [hourHeight, hoursPerDay, snapToHalfHour]);

  // Convert time in minutes to Y position
  const getYFromTime = useCallback((minutes: number): number => {
    return (minutes / 60) * hourHeight;
  }, [hourHeight]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!columnRef.current || !onTimeRangeSelect) return;

    const rect = columnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const startTime = getTimeFromY(y);

    setIsSelecting(true);
    originalStartTimeRef.current = startTime;
    currentEndTimeRef.current = startTime;
    setSelection({ startTime, endTime: startTime });
  }, [onTimeRangeSelect, getTimeFromY]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting || !columnRef.current || originalStartTimeRef.current === null) return;

    const rect = columnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const endTime = getTimeFromY(y);
    currentEndTimeRef.current = endTime;

    setSelection({
      startTime: Math.min(originalStartTimeRef.current, endTime),
      endTime: Math.max(originalStartTimeRef.current, endTime)
    });
  }, [isSelecting, getTimeFromY]);

  const handleMouseUp = useCallback(() => {
    if (!isSelecting || !onTimeRangeSelect || originalStartTimeRef.current === null || currentEndTimeRef.current === null) {
      setIsSelecting(false);
      setSelection(null);
      originalStartTimeRef.current = null;
      currentEndTimeRef.current = null;
      return;
    }

    const startTime = originalStartTimeRef.current;
    const endTime = currentEndTimeRef.current;
    const duration = Math.abs(endTime - startTime);

    // Only trigger if there's a meaningful selection (at least 30 minutes)
    if (duration >= 30) {
      const actualStartTime = Math.min(startTime, endTime);
      const actualEndTime = Math.max(startTime, endTime);

      const startHours = Math.floor(actualStartTime / 60) + dayStartHour;
      const startMinutes = actualStartTime % 60;
      const endHours = Math.floor(actualEndTime / 60) + dayStartHour;
      const endMinutes = actualEndTime % 60;

      const startTimeStr = `${String(startHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')}`;
      const endTimeStr = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;

      onTimeRangeSelect({
        date,
        startTime: startTimeStr,
        endTime: endTimeStr
      });
    }

    setIsSelecting(false);
    setSelection(null);
    originalStartTimeRef.current = null;
    currentEndTimeRef.current = null;
  }, [isSelecting, onTimeRangeSelect, date, dayStartHour]);

  // Handle mouse events on document for drag outside column
  useEffect(() => {
    if (!isSelecting) return;

    const handleMouseMoveGlobal = (e: MouseEvent) => {
      if (!columnRef.current || originalStartTimeRef.current === null) return;

      const rect = columnRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const endTime = getTimeFromY(y);
      currentEndTimeRef.current = endTime;

      setSelection({
        startTime: Math.min(originalStartTimeRef.current, endTime),
        endTime: Math.max(originalStartTimeRef.current, endTime)
      });
    };

    const handleMouseUpGlobal = () => {
      handleMouseUp();
    };

    document.addEventListener('mousemove', handleMouseMoveGlobal);
    document.addEventListener('mouseup', handleMouseUpGlobal);

    return () => {
      document.removeEventListener('mousemove', handleMouseMoveGlobal);
      document.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [isSelecting, getTimeFromY, handleMouseUp]);

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

  const selectionTop = selection ? getYFromTime(Math.min(selection.startTime, selection.endTime)) : null;
  const selectionHeight = selection ? Math.abs(selection.endTime - selection.startTime) / 60 * hourHeight : null;

  return (
    <Box
      ref={columnRef}
      className={`${styles.dayColumn} ${isToday ? styles.todayColumn : styles.notTodayColumn} ${isSelecting ? styles.selecting : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
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

      {selection && selectionTop !== null && selectionHeight !== null && (
        <Box
          className={styles.timeSelection}
          style={{
            top: `${selectionTop}px`,
            height: `${Math.max(selectionHeight, 2)}px`
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
