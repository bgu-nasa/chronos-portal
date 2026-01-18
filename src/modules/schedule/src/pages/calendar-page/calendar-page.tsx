import { useState, useCallback } from "react";
import { Box, Flex, Paper } from "@mantine/core";
import styles from "./calendar-page.module.css";
import { SchedulingPeriodSelect } from "./components/scheduling-period-select";
import { TimeSelectionModal } from "./components/time-selection-modal";
import { WeekView } from "@/common/components/calendar";
import type { TimeSelection } from "@/common/components/calendar/week-view/time-grid";
import { useUserConstraints, useUserPreferences } from "@/modules/schedule/src/hooks/use-constraints";
import { useOrganization } from "@/infra/service";

export function CalendarPage() {
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<{
    dateStr: string;
    startTime: string;
    endTime: string;
    timeRange: string;
  } | null>(null);

  const { createUserConstraint } = useUserConstraints();
  const { createUserPreference } = useUserPreferences();
  const { organization } = useOrganization();

  const getCurrentUserId = useCallback((): string | null => {
    // Get user ID from the first role assignment
    // All roles for a user have the same userId
    return organization?.userRoles[0]?.userId || null;
  }, [organization]);

  const handleTimeRangeSelected = useCallback((selection: TimeSelection) => {
    if (!selectedPeriodId) {
      alert("Please select a scheduling period first");
      return;
    }

    const userId = getCurrentUserId();
    if (!userId) {
      alert("Unable to get current user. Please log in again.");
      return;
    }

    // Format time range as HH:mm
    const formatTime = (hour: number) => {
      const h = Math.floor(hour);
      const m = Math.floor((hour - h) * 60);
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const startTime = formatTime(selection.startHour);
    const endTime = formatTime(selection.endHour);
    const dateStr = selection.date.toLocaleDateString();

    // Get weekday name
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = weekdays[selection.date.getDay()];

    // Format as: "Monday 09:00-10:30"
    const timeRange = `${weekday} ${startTime}-${endTime}`;

    setPendingSelection({ dateStr, startTime, endTime, timeRange });
    setModalOpened(true);
  }, [selectedPeriodId, getCurrentUserId]);

  const handleCreateConstraint = useCallback(() => {
    if (!pendingSelection || !selectedPeriodId) return;

    const userId = getCurrentUserId();
    if (!userId) {
      alert("Unable to get current user. Please log in again.");
      return;
    }

    createUserConstraint({
      key: "unavailable_time",
      value: pendingSelection.timeRange,
      userId: userId,
      schedulingPeriodId: selectedPeriodId
    });
  }, [pendingSelection, selectedPeriodId, createUserConstraint, getCurrentUserId]);

  const handleCreatePreference = useCallback(() => {
    if (!pendingSelection || !selectedPeriodId) return;

    const userId = getCurrentUserId();
    if (!userId) {
      alert("Unable to get current user. Please log in again.");
      return;
    }

    createUserPreference({
      key: "preferred_time",
      value: pendingSelection.timeRange,
      userId: userId,
      schedulingPeriodId: selectedPeriodId
    });
  }, [pendingSelection, selectedPeriodId, createUserPreference, getCurrentUserId]);

  return (
    <Flex className={styles.calendarPageContainer} gap="md">
      <Paper withBorder p="md" className={styles.sidebar}>
        <SchedulingPeriodSelect value={selectedPeriodId} onChange={setSelectedPeriodId} />
      </Paper>
      <Box className={styles.content}>
        <WeekView events={[]} onTimeRangeSelected={handleTimeRangeSelected} />
      </Box>

      {pendingSelection && (
        <TimeSelectionModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          dateStr={pendingSelection.dateStr}
          startTime={pendingSelection.startTime}
          endTime={pendingSelection.endTime}
          onCreateConstraint={handleCreateConstraint}
          onCreatePreference={handleCreatePreference}
        />
      )}
    </Flex>
  );
}
