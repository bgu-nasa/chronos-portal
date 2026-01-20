/** @author noamarg */
import React from 'react';
import { Box, ScrollArea } from '@mantine/core';

import type { CalendarEvent } from "@/common/types";

import { TimeColumn, DayColumn } from './';
import styles from './time-grid.module.css';

interface TimeGridProps {
  weekDates: Date[];
  events: CalendarEvent[];
  hourHeight?: number;
  dayStartHour?: number;
  hoursPerDay?: number;
  onTimeRangeSelect?: (selection: { date: Date; startTime: string; endTime: string }) => void;
}

export const TimeGrid: React.FC<TimeGridProps> = ({
  weekDates,
  events,
  hourHeight,
  dayStartHour = 0,
  hoursPerDay = 24,
  onTimeRangeSelect
}) => {
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
            onTimeRangeSelect={onTimeRangeSelect}
          />
        ))}
      </Box>
    </ScrollArea>
  );
};
