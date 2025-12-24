/** @author noamarg */

import { Box } from '@mantine/core';
import { WeekView } from '@/modules/calendar/src/components';
import { MOCK_ACADEMIC_SCHEDULE } from '@/modules/calendar/.mock';


export default function CalendarPage() {
  return (
    <Box p="md" style={{ height: 'calc(100vh - 60px)' }}>
      <WeekView events={MOCK_ACADEMIC_SCHEDULE} />
    </Box>
  );
}
