import IORedis from 'ioredis';

const LOG_KEY = 'executionLogs';

export interface ExecutionLog {
    taskId: string;
    executedAt: string;
    payload: any;
}

export const addExecutionLog = async (redis: IORedis, log: ExecutionLog): Promise<void> => {
    await redis.lpush(LOG_KEY, JSON.stringify(log));
};

export const getExecutionLogs = async (redis: IORedis): Promise<ExecutionLog[]> => {
    const logs = await redis.lrange(LOG_KEY, 0, 100);
    return logs.map(log => JSON.parse(log));
};
