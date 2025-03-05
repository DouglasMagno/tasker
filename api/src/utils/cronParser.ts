import cronParser from 'cron-parser';

export const getNextExecution = (cronExpr: string): Date => {
    try {
        const interval = cronParser.parseExpression(cronExpr, { currentDate: new Date() });
        return interval.next().toDate();
    } catch (err) {
        throw new Error('Invalid cron expression');
    }
};
