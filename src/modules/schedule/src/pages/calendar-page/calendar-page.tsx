import { useState, useEffect } from "react";
import { Box, Flex, Paper } from "@mantine/core";

import { $app } from "@/infra/service";
import { WeekView } from "@/common/components/calendar";
import { useUserConstraints } from "@/modules/schedule/src/hooks";
import { serializeForbiddenTimeRange, type ForbiddenTimeRangeEntry } from "@/modules/schedule/src/pages/constraints-page/utils";

import { SchedulingPeriodSelect, TimeRangeSelectionModal } from "./components";
import styles from "./calendar-page.module.css";

interface TimeRangeSelection {
  date: Date;
  startTime: string;
  endTime: string;
}

export function CalendarPage() {
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);
  const [timeRangeSelection, setTimeRangeSelection] = useState<TimeRangeSelection | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const { createUserConstraint, isLoading } = useUserConstraints();

  useEffect(() => {
    const org = $app.organization.getOrganization();
    const userId = org?.userRoles?.[0]?.userId;
    if (userId) {
      setCurrentUserId(userId);
    }
  }, []);

  const handleTimeRangeSelect = (selection: { date: Date; startTime: string; endTime: string }) => {
    // Only allow selection if a scheduling period is selected
    if (!selectedPeriodId) {
      return;
    }
    setTimeRangeSelection(selection);
    setModalOpened(true);
  };

  const handleConfirmConstraint = async () => {
    if (!timeRangeSelection || !selectedPeriodId || !currentUserId) {
      return;
    }

    // Get weekday name from the date
    const weekdayName = timeRangeSelection.date.toLocaleDateString('en-US', { weekday: 'long' });

    // Create the constraint entry
    const entry: ForbiddenTimeRangeEntry = {
      weekday: weekdayName,
      startTime: timeRangeSelection.startTime,
      endTime: timeRangeSelection.endTime,
    };

    // Serialize to backend format
    const value = serializeForbiddenTimeRange([entry]);

    // Create the constraint
    await createUserConstraint({
      userId: currentUserId,
      schedulingPeriodId: selectedPeriodId,
      key: "forbidden_timerange",
      value: value,
    });

    // Close modal and reset selection
    setModalOpened(false);
    setTimeRangeSelection(null);
  };

  return (
    <Flex className={styles.calendarPageContainer} gap="md">
      <Paper withBorder p="md" className={styles.sidebar}>
        <SchedulingPeriodSelect value={selectedPeriodId} onChange={setSelectedPeriodId} />
      </Paper>
      <Box className={styles.content}>
        <WeekView
          events={[]}
          onTimeRangeSelect={handleTimeRangeSelect}
        />
      </Box>

      {timeRangeSelection && (
        <TimeRangeSelectionModal
          opened={modalOpened}
          onClose={() => {
            setModalOpened(false);
            setTimeRangeSelection(null);
          }}
          onConfirm={handleConfirmConstraint}
          date={timeRangeSelection.date}
          startTime={timeRangeSelection.startTime}
          endTime={timeRangeSelection.endTime}
          loading={isLoading}
        />
      )}
    </Flex>
  );
}
