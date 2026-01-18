import { Modal, Button, Stack, Text, Group } from "@mantine/core";

interface TimeSelectionModalProps {
  readonly opened: boolean;
  readonly onClose: () => void;
  readonly dateStr: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly onCreateConstraint: () => void;
  readonly onCreatePreference: () => void;
}

export function TimeSelectionModal({
  opened,
  onClose,
  dateStr,
  startTime,
  endTime,
  onCreateConstraint,
  onCreatePreference
}: TimeSelectionModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Create Time Entry" centered>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          {dateStr} from {startTime} to {endTime}
        </Text>

        <Text size="sm">
          What would you like to create for this time range?
        </Text>

        <Group grow>
          <Button
            variant="filled"
            color="red"
            onClick={() => {
              onCreateConstraint();
              onClose();
            }}
          >
            Can't Attend
          </Button>
          <Button
            variant="filled"
            color="blue"
            onClick={() => {
              onCreatePreference();
              onClose();
            }}
          >
            I Prefer This
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
