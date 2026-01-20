/** @author noamarg */
import React, { useState, useMemo } from 'react';
import { Box, Button, Group, Text, Paper } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { WeekHeader } from './week-header';
import { TimeGrid } from './time-grid';
import type { CalendarEvent } from "@/common/types";

import styles from './week-view.module.css';
import resources from './week-view.resources.json';

interface WeekViewProps {
  initialDate?: Date;
  events: CalendarEvent[];
  dayStartHour?: number;
  dayEndHour?: number;
}

export const WeekView: React.FC<WeekViewProps> = ({
  initialDate = new Date(),
  events,
  dayStartHour = resources.config.defaultStartHour,
  dayEndHour = resources.config.defaultEndHour
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
    <Paper shadow="xs" p="md" withBorder className={styles.weekViewPaper}>
      <Group justify="space-between" mb="md">
        <Group>
          <Button variant="default" onClick={handleToday}>{resources.navigation.today}</Button>
          <Group gap={4}>
            <Button variant="subtle" size="compact-md" onClick={handlePreviousWeek}>{resources.navigation.prev}</Button>
            <Button variant="subtle" size="compact-md" onClick={handleNextWeek}>{resources.navigation.next}</Button>
          </Group>
          <Text size="xl" fw={700}>{monthLabel}</Text>
        </Group>
      </Group>

      <Box className={styles.navigationContainer}>
        <WeekHeader weekDates={weekDates} />
        <TimeGrid
          weekDates={weekDates}
          events={events}
          dayStartHour={dayStartHour}
          hoursPerDay={hoursPerDay}
          hourHeight={resources.config.hourHeight || 60}
        />
      </Box>
    </Paper>
  );
};
