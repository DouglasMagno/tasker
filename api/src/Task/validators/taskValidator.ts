import { getNextExecution } from '../../utils/cronParser';

export const validateTaskInput = (type: string, schedule: string): string | null => {
    if (!type || !schedule) {
        return 'Type and schedule are required.';
    }

    if (type !== 'one-time' && type !== 'recurring') {
        return 'Invalid task type.';
    }

    if (type === 'one-time') {
        const date = new Date(schedule);
        if (isNaN(date.getTime())) {
            return 'Invalid datetime format for one-time task.';
        }
    } else if (type === 'recurring') {
        const parts = schedule.trim().split(/\s+/);
        if (parts.length !== 5) {
            return 'Invalid cron expression for recurring task.';
        }
        try {
            getNextExecution(schedule);
        } catch (err) {
            return 'Invalid cron expression for recurring task.';
        }
    }
    return null;
};
