/** @author noamarg */
import React from 'react';
import { Box, ScrollArea } from '@mantine/core';
import { TimeColumn } from './TimeColumn';
import { DayColumn } from './DayColumn';
import type { CalendarEvent } from '@/modules/calendar/src/types';

import styles from './TimeGrid.module.css';

interface TimeGridProps {
  weekDates: Date[];
  events: CalendarEvent[];
  hourHeight?: number;
  dayStartHour?: number;
  hoursPerDay?: number;
}

export const TimeGrid: React.FC<TimeGridProps> = ({
  weekDates,
  events,
  hourHeight = 60,
  dayStartHour = 0,
  hoursPerDay = 24
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
          />
        ))}
      </Box>
    </ScrollArea>
  );
};
