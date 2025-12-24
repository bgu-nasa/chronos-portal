/** @author noamarg */
import React, { useState, useMemo } from 'react';
import { Box, Button, Group, Text, Paper } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { WeekHeader } from './WeekHeader';
import { TimeGrid } from './TimeGrid';
import type { CalendarEvent } from '@/modules/calendar/src/types';

interface WeekViewProps {
  initialDate?: Date;
  events: CalendarEvent[];
  dayStartHour?: number;
  dayEndHour?: number;
}

export const WeekView: React.FC<WeekViewProps> = ({
  initialDate = new Date(),
  events,
  dayStartHour = 8,
  dayEndHour = 20
}) => {
  const [currentDate, setCurrentDate] = useState(initialDate);

  // Calculate dates for the current week (starting Sunday)
  const weekDates = useMemo(() => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Go to Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentDate]);

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  useHotkeys([
    ['t', handleToday],
    ['ArrowLeft', handlePreviousWeek],
    ['ArrowRight', handleNextWeek],
  ]);

  const monthLabel = weekDates[0].toLocaleString('default', { month: 'long', year: 'numeric' });

  const hoursPerDay = Math.max(1, dayEndHour - dayStartHour);

  return (
    <Paper shadow="xs" p="md" withBorder style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Group justify="space-between" mb="md">
        <Group>
          <Button variant="default" onClick={handleToday}>Today</Button>
          <Group gap={4}>
            <Button variant="subtle" size="compact-md" onClick={handlePreviousWeek}>&lt;</Button>
            <Button variant="subtle" size="compact-md" onClick={handleNextWeek}>&gt;</Button>
          </Group>
          <Text size="xl" fw={700}>{monthLabel}</Text>
        </Group>
      </Group>

      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <WeekHeader weekDates={weekDates} />
        <TimeGrid
          weekDates={weekDates}
          events={events}
          dayStartHour={dayStartHour}
          hoursPerDay={hoursPerDay}
        />
      </Box>
    </Paper>
  );
};
