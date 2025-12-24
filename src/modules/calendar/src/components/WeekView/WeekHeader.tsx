/** @author noamarg */
import React from 'react';
import { Box, Text } from '@mantine/core';
import styles from './WeekHeader.module.css';
import resources from './WeekHeader.resources.json';

interface WeekHeaderProps {
  weekDates: Date[];
}

export const WeekHeader: React.FC<WeekHeaderProps> = ({ weekDates }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Box className={styles.weekHeaderContainer}>
      {weekDates.map((date) => {
        const isToday = date.getTime() === today.getTime();
        return (
          <Box key={date.toISOString()} className={styles.dayHeader}>
            <Text size="xs" fw={isToday ? 700 : 500} c={isToday ? 'blue' : 'dimmed'} tt="uppercase">
              {date.toLocaleDateString('default', { weekday: resources.formatting.dayName as "short" | "long" | "narrow" })}
            </Text>
            <Text
              className={`${styles.dayNumber} ${isToday ? styles.activeDay : ''}`}
              size="lg"
              fw={isToday ? 700 : 400}
            >
              {date.toLocaleDateString('default', { day: resources.formatting.dayNumber as "numeric" | "2-digit" })}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};
