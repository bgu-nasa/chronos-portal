/** @author noamarg */
import React, { useState, useCallback } from 'react';
import { Box, ScrollArea } from '@mantine/core';
import { TimeColumn } from './time-column';
import { DayColumn } from './day-column';
import type { CalendarEvent } from "@/common/types";

import styles from './time-grid.module.css';

export interface TimeSelection {
  date: Date;
  startHour: number;
  endHour: number;
}

interface TimeGridProps {
  weekDates: Date[];
  events: CalendarEvent[];
  hourHeight?: number;
  dayStartHour?: number;
  hoursPerDay?: number;
  onTimeRangeSelected?: (selection: TimeSelection) => void;
}

export const TimeGrid: React.FC<TimeGridProps> = ({
  weekDates,
  events,
  hourHeight,
  dayStartHour = 0,
  hoursPerDay = 24,
  onTimeRangeSelected
}) => {
  const [selection, setSelection] = useState<TimeSelection | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleSelectionStart = useCallback((date: Date, hour: number) => {
    setIsSelecting(true);
    setSelection({ date, startHour: hour, endHour: hour });
  }, []);

  const handleSelectionMove = useCallback((hour: number) => {
    if (isSelecting && selection) {
      setSelection(prev => prev ? { ...prev, endHour: hour } : null);
    }
  }, [isSelecting, selection]);

  const handleSelectionEnd = useCallback(() => {
    if (selection && isSelecting) {
      // Normalize selection (ensure start < end)
      const normalizedSelection = {
        ...selection,
        startHour: Math.min(selection.startHour, selection.endHour),
        endHour: Math.max(selection.startHour, selection.endHour)
      };

      if (onTimeRangeSelected) {
        onTimeRangeSelected(normalizedSelection);
      }
    }
    setIsSelecting(false);
    setSelection(null);
  }, [selection, isSelecting, onTimeRangeSelected]);

  return (
    <ScrollArea className={styles.scrollArea} type="auto">
      <Box className={styles.gridContent}>
        <TimeColumn
          hourHeight={hourHeight}
          dayStartHour={dayStartHour}
          hoursPerDay={hoursPerDay}
        />

        {weekDates.map((date) => (
          <DayColumn
            key={date.toISOString()}
            date={date}
            events={events}
            hourHeight={hourHeight}
            dayStartHour={dayStartHour}
            hoursPerDay={hoursPerDay}
            selection={selection?.date.toDateString() === date.toDateString() ? selection : null}
            isSelecting={isSelecting}
            onSelectionStart={handleSelectionStart}
            onSelectionMove={handleSelectionMove}
            onSelectionEnd={handleSelectionEnd}
          />
        ))}
      </Box>
    </ScrollArea>
  );
};
