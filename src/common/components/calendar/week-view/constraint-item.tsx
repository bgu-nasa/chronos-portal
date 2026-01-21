/** @author noamarg */
import React from 'react';
import { Box } from '@mantine/core';

import styles from './constraint-item.module.css';

interface ConstraintItemProps {
    startTime: string;
    endTime: string;
    hourHeight: number;
    dayStartHour: number;
}

export const ConstraintItem: React.FC<ConstraintItemProps> = ({
    startTime,
    endTime,
    hourHeight,
    dayStartHour,
}) => {
    // Parse time strings (HH:mm) to hours
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startHour = startHours + startMinutes / 60;
    const endHour = endHours + endMinutes / 60;

    const top = (startHour - dayStartHour) * hourHeight;
    const height = (endHour - startHour) * hourHeight;

    return (
        <Box
            className={styles.constraintItem}
            style={{
                top: `${top}px`,
                height: `${height}px`,
            }}
            title={`Unavailable: ${startTime} - ${endTime}`}
        />
    );
};
