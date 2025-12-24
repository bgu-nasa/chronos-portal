/** @author noamarg */
import { Box } from '@mantine/core';
import { WeekView } from '@/modules/calendar/src/components';
import { MOCK_ACADEMIC_SCHEDULE } from '@/modules/calendar/.mock';
import styles from './CalendarPage.module.css';

export default function CalendarPage() {
  return (
    <Box className={styles.calendarPageContainer}>
      <WeekView events={MOCK_ACADEMIC_SCHEDULE} />
    </Box>
  );
}
