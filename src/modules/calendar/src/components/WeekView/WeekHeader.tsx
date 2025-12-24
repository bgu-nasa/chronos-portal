/** @author noamarg */

import React from 'react';
import { Box, Text } from '@mantine/core';

interface WeekHeaderProps {
  weekDates: Date[];
}

export const WeekHeader: React.FC<WeekHeaderProps> = ({ weekDates }) => {
  return (
    <Box
      style={{
        display: 'flex',
        borderBottom: '1px solid var(--mantine-color-gray-3)',
        paddingBottom: '8px',
        paddingTop: '16px'
      }}
    >
      {/* Spacer for TimeColumn */}
      <Box style={{ width: '60px', flexShrink: 0 }} />

      {weekDates.map((date) => {
        const isToday = new Date().toDateString() === date.toDateString();

        return (
          <Box
            key={date.toISOString()}
            style={{
              flex: 1,
              textAlign: 'center'
            }}
          >
            <Text
              size="sm"
              c={isToday ? 'blue' : 'dimmed'}
              fw={500}
            >
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </Text>
            <Box
              style={{
                display: 'inline-block',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                lineHeight: '30px',
                backgroundColor: isToday ? 'var(--mantine-color-blue-filled)' : 'transparent',
              }}
            >
              <Text
                size="xl"
                c={isToday ? 'white' : 'dark'}
                fw={700}
                style={{
                  lineHeight: '30px',
                  display: 'block'
                }}
              >
                {date.getDate()}
              </Text>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
