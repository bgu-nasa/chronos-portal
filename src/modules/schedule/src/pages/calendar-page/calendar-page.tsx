import { useState, useEffect, useMemo } from "react";
import { Box, Flex, Paper, Group } from "@mantine/core";

import { $app } from "@/infra/service";
import { WeekView } from "@/common/components/calendar";
import { useUsers } from "@/modules/auth/src/hooks";
import { useUserConstraints, useSchedulingPeriods } from "@/modules/schedule/src/hooks";
import { serializeForbiddenTimeRange, parseForbiddenTimeRange, type ForbiddenTimeRangeEntry } from "@/modules/schedule/src/pages/constraints-page/utils";

import { SchedulingPeriodSelect, TimeRangeSelectionModal, UserSelect } from "./components";
import styles from "./calendar-page.module.css";

interface TimeRangeSelection {
  date: Date;
  startTime: string;
  endTime: string;
}

export function CalendarPage() {
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [timeRangeSelection, setTimeRangeSelection] = useState<TimeRangeSelection | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);

  const { createUserConstraint, fetchUserConstraintsByUser, userConstraints, isLoading } = useUserConstraints();
  const { schedulingPeriods, fetchSchedulingPeriods } = useSchedulingPeriods();
  const { fetchUsers } = useUsers();

  // Initialize user and admin status
  useEffect(() => {
    const org = $app.organization.getOrganization();
    const userId = org?.userRoles?.[0]?.userId;
    const userIsAdmin = $app.organization.isAdministrator();

    if (userId) {
      setCurrentUserId(userId);
      // For non-admin users, set and lock the user selection
      if (!userIsAdmin) {
        setSelectedUserId(userId);
      }
    }
    setIsAdmin(userIsAdmin);

    // Fetch all users if admin
    if (userIsAdmin) {
      fetchUsers();
    }
  }, [fetchUsers]);

  // Fetch scheduling periods and set default
  useEffect(() => {
    fetchSchedulingPeriods();
  }, [fetchSchedulingPeriods]);

  // Set default scheduling period to the most current active one
  useEffect(() => {
    if (schedulingPeriods.length > 0 && !selectedPeriodId) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      // Filter out ended periods (toDate < today)
      const activePeriods = schedulingPeriods.filter((period) => {
        const toDate = new Date(period.toDate);
        toDate.setHours(0, 0, 0, 0);
        return toDate >= now;
      });

      if (activePeriods.length > 0) {
        // Sort by fromDate ascending and pick the one with the earliest start time
        const sortedPeriods = [...activePeriods].sort((a, b) => {
          const dateA = new Date(a.fromDate).getTime();
          const dateB = new Date(b.fromDate).getTime();
          return dateA - dateB;
        });

        setSelectedPeriodId(sortedPeriods[0].id);
      }
    }
  }, [schedulingPeriods, selectedPeriodId]);

  // Fetch constraints based on user role and selection
  useEffect(() => {
    if (isAdmin && selectedUserId) {
      fetchUserConstraintsByUser(selectedUserId);
    } else if (!isAdmin && currentUserId) {
      fetchUserConstraintsByUser(currentUserId);
    }
  }, [isAdmin, selectedUserId, currentUserId, fetchUserConstraintsByUser]);

  // Convert constraints to visualizations
  const constraintVisualizations = useMemo(() => {
    if (isAdmin && !selectedUserId) {
      return [];
    }

    const userIdToShow = isAdmin ? selectedUserId : currentUserId;
    if (!userIdToShow || !selectedPeriodId) {
      return [];
    }

    // Filter constraints for the selected user and period
    const relevantConstraints = userConstraints.filter(
      (c) => c.userId === userIdToShow &&
        c.schedulingPeriodId === selectedPeriodId &&
        c.key === "forbidden_timerange"
    );

    // Parse and flatten all constraint entries
    const visualizations: Array<{ weekday: string; startTime: string; endTime: string }> = [];

    for (const constraint of relevantConstraints) {
      const entries = parseForbiddenTimeRange(constraint.value);
      visualizations.push(...entries);
    }

    return visualizations;
  }, [userConstraints, isAdmin, selectedUserId, currentUserId, selectedPeriodId]);

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

    // Get weekday name from the date (in user's local timezone)
    const weekdayName = timeRangeSelection.date.toLocaleDateString('en-US', { weekday: 'long' });

    // Create the constraint entry (times are in user's local timezone)
    const entry: ForbiddenTimeRangeEntry = {
      weekday: weekdayName,
      startTime: timeRangeSelection.startTime, // Local time
      endTime: timeRangeSelection.endTime, // Local time
    };

    // Serialize to backend format (converts local time to UTC automatically)
    const value = serializeForbiddenTimeRange([entry]);

    // Create the constraint
    await createUserConstraint({
      userId: currentUserId,
      schedulingPeriodId: selectedPeriodId,
      key: "forbidden_timerange",
      value: value,
    });

    // Refresh constraints to show the new one
    if (isAdmin && selectedUserId) {
      await fetchUserConstraintsByUser(selectedUserId);
    } else if (!isAdmin && currentUserId) {
      await fetchUserConstraintsByUser(currentUserId);
    }

    // Close modal and reset selection
    setModalOpened(false);
    setTimeRangeSelection(null);
  };

  return (
    <Flex className={styles.calendarPageContainer} direction="column" gap="md">
      <Paper withBorder p="md" className={styles.topBar}>
        <Group
          gap="md"
          align="flex-start"
          className={styles.controlsGroup}
          wrap="wrap"
        >
          <Box className={styles.controlItem}>
            <SchedulingPeriodSelect value={selectedPeriodId} onChange={setSelectedPeriodId} />
          </Box>
          {isAdmin ? (
            <Box className={styles.controlItem}>
              <UserSelect value={selectedUserId} onChange={setSelectedUserId} />
            </Box>
          ) : (
            <Box className={styles.controlItem}>
              <UserSelect value={selectedUserId} onChange={() => { }} disabled />
            </Box>
          )}
        </Group>
      </Paper>
      <Box className={styles.content}>
        <WeekView
          events={[]}
          constraints={constraintVisualizations}
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
