/** @author noamarg */
import React from 'react';
import { Box, Text } from '@mantine/core';

interface TimeColumnProps {
  hourHeight?: number;
  dayStartHour?: number;
  hoursPerDay?: number;
}

export const TimeColumn: React.FC<TimeColumnProps> = ({
  hourHeight = 60,
  dayStartHour = 0,
  hoursPerDay = 24
}) => {

  const times = Array.from({ length: hoursPerDay + 1 }).map((_, i) => {
    const hour = i + dayStartHour;
    let displayHour;

    // Simple 12-hour format logic
    const h = hour % 24;
    if (h === 0) displayHour = '12 AM';
    else if (h < 12) displayHour = `${h} AM`;
    else if (h === 12) displayHour = '12 PM';
    else displayHour = `${h - 12} PM`;

    return (
      <Box
        key={`time-${hour}`}
        style={{
          height: i === hoursPerDay ? 0 : `${hourHeight}px`,
          position: 'relative',
          textAlign: 'right',
          paddingRight: '8px'
        }}
      >
        <Text size="xs" c="dimmed" style={{ transform: 'translateY(-50%)' }}>
          {displayHour}
        </Text>
      </Box>
    );
  });

  return (
    <Box
      style={{
        width: '60px',
        flexShrink: 0,
        backgroundColor: 'var(--mantine-color-body)',
        borderRight: '1px solid var(--mantine-color-gray-3)'
      }}
    >
      {times}
    </Box>
  );
};
