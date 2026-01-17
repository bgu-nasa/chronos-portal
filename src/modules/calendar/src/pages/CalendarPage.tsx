import type { ReactNode } from "react";
import { Box } from "@mantine/core";
import styles from "./CalendarPage.module.css";

interface CalendarPageProps {
  readonly children: ReactNode;
}

export default function CalendarPage({ children }: CalendarPageProps) {
  return <Box className={styles.calendarPageContainer}>{children}</Box>;
}
