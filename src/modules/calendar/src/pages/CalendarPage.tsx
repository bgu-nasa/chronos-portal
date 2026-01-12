import { Routes, Route } from 'react-router';
import { Box } from '@mantine/core';
import { WeekView } from '@/modules/calendar/src/components';
import { EventDetailsModal } from '@/modules/calendar/src/components/WeekView/EventDetailsModal';
import { MOCK_ACADEMIC_SCHEDULE } from '@/modules/calendar/.mock';
import styles from './CalendarPage.module.css';

export default function CalendarPage() {
  return (
    <Box className={styles.calendarPageContainer}>
      <Routes>
        <Route path="/" element={<WeekView events={MOCK_ACADEMIC_SCHEDULE} />} />
        <Route path="/event/:id" element={
          <>
            <WeekView events={MOCK_ACADEMIC_SCHEDULE} />
            <EventDetailsModal />
          </>
        } />
      </Routes>
    </Box>
  );
}
