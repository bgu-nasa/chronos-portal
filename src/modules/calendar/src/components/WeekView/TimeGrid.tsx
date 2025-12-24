/** @author noamarg */
import React from 'react';
import { Box, ScrollArea } from '@mantine/core';
import { TimeColumn } from './TimeColumn';
import { DayColumn } from './DayColumn';
import type { CalendarEvent } from '@/modules/calendar/src/types';

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
    <ScrollArea style={{ height: 'calc(100vh - 160px)' }} type="auto">
      <Box style={{ display: 'flex', padding: '10px 0' }}>
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
