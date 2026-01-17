import type { ReactNode } from "react";
import { Box } from "@mantine/core";
import styles from "./calendar-page.module.css";

interface CalendarPageProps {
  readonly children: ReactNode;
}

export function CalendarPage({ children }: CalendarPageProps) {
  return <Box className={styles.calendarPageContainer}>{children}</Box>;
}
