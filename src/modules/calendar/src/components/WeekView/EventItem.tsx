/** @author noamarg */
import React, { useMemo } from 'react';
import { Box, Text, Popover, Stack, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { CalendarEvent } from '@/modules/calendar/src/types';

interface EventItemProps {
  event: CalendarEvent;
  dayStartHour?: number;
  hourHeight?: number;
  left?: number; // Position percentage
  width?: number; // Width percentage
}

export const EventItem: React.FC<EventItemProps> = ({
  event,
  dayStartHour = 0,
  hourHeight = 60,
  left = 0,
  width = 100
}) => {
  const [opened, { close, open }] = useDisclosure(false);

  // Calculate position
  const { top, height } = useMemo(() => {
    const startHour = event.start.getHours() + event.start.getMinutes() / 60;
    const endHour = event.end.getHours() + event.end.getMinutes() / 60;

    const topOffset = (startHour - dayStartHour) * hourHeight;
    const duration = (endHour - startHour) * hourHeight;

    return { top: topOffset, height: duration };
  }, [event, dayStartHour, hourHeight]);

  return (
    <Popover
      width={300}
      position="right"
      withArrow
      shadow="md"
      opened={opened}
    >
      <Popover.Target>
        <Box
          onMouseEnter={open}
          onMouseLeave={close}
          bg={event.color ? `${event.color}.6` : 'blue.6'}
          style={{
            position: 'absolute',
            top: `${top}px`,
            height: `${height}px`,
            left: `${left}%`,
            width: `${width}%`,
            borderRadius: '4px',
            padding: '4px',
            overflow: 'hidden',
            color: 'var(--mantine-color-white)',
            fontSize: '12px',
            zIndex: 10,
            cursor: 'pointer',
            boxShadow: 'var(--mantine-shadow-xs)',
            border: '1px solid var(--mantine-color-white)',
            transition: 'all 0.2s ease'
          }}
        >
          <Text fw={600} size="xs" truncate>{event.title}</Text>
          {height > 35 && (
            <Text size="xs" truncate opacity={0.9}>
              {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          )}
        </Box>
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: 'none' }}>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text fw={700} size="sm">{event.title}</Text>
            <Box w={12} h={12} bg={event.color ? `${event.color}.6` : 'blue.6'} style={{ borderRadius: '50%' }} />
          </Group>
          <Text size="xs" c="dimmed">
            {event.start.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          <Text size="xs" fw={500}>
            {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {event.description && (
            <Text size="xs">{event.description}</Text>
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};
