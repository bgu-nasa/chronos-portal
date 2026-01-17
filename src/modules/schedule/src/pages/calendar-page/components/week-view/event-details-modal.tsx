/** @author noamarg */
import React from 'react';
import { Modal, Text, Card, Stack, Group, Badge, Divider } from '@mantine/core';
import { useNavigate, useParams } from 'react-router';
import { MOCK_ACADEMIC_SCHEDULE } from "@/modules/schedule/.mock";
import styles from './event-details-modal.module.css';
import resources from './event-details-modal.resources.json';
import type { CalendarEvent } from "../../../types";

export const EventDetailsModal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const event = MOCK_ACADEMIC_SCHEDULE.find((e: CalendarEvent) => e.id === id);

  const handleClose = () => {
    navigate('/calendar');
  };

  if (!event) return null;

  const timeString = `${event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  const dateString = event.start.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <Modal
      opened={true}
      onClose={handleClose}
      title={resources.titles.modal}
      size="md"
      centered
    >
      <Card padding="md" className={styles.eventCard} style={{ borderColor: `var(--mantine-color-${event.color || 'blue'}-6)` }}>
        <Stack gap="sm">
          <Group justify="space-between">
            <Text fw={700} size="xl">{event.title}</Text>
            <Badge color={event.color || 'blue'} variant="light">
              {event.color || 'blue'}
            </Badge>
          </Group>

          <Divider />

          <Stack gap={2}>
            <Text size="xs" className={styles.label}>{resources.labels.time}</Text>
            <Text size="sm">{dateString}</Text>
            <Text size="sm" fw={500}>{timeString}</Text>
          </Stack>

          {event.description && (
            <Stack gap={2}>
              <Text size="xs" className={styles.label}>{resources.labels.description}</Text>
              <Text size="sm">{event.description}</Text>
            </Stack>
          )}
        </Stack>
      </Card>
    </Modal>
  );
};
