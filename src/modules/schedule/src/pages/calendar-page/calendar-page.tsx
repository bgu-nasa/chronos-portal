import { useState } from "react";
import { Box, Flex, Paper } from "@mantine/core";
import styles from "./calendar-page.module.css";
import { SchedulingPeriodSelect } from "./components/scheduling-period-select";
import { WeekView } from "@/common/components/calendar";

export function CalendarPage() {
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);

  return (
    <Flex className={styles.calendarPageContainer} gap="md">
      <Paper withBorder p="md" className={styles.sidebar}>
        <SchedulingPeriodSelect value={selectedPeriodId} onChange={setSelectedPeriodId} />
      </Paper>
      <Box className={styles.content}>
        <WeekView events={[]} />
      </Box>
    </Flex>
  );
}
