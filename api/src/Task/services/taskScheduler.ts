import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { Task } from '../models/Task';

export const scheduleTask = async (redis: IORedis, task: Task) => {
    const delay = task.nextExecution.getTime() - Date.now();
    const taskQueue = new Queue('taskQueue', { connection: redis });
    await taskQueue.add(task.id, task, { delay: delay > 0 ? delay : 0 });
};

export const removeScheduledTask = async (redis: IORedis, task: Task) => {
    const taskQueue = new Queue('taskQueue', { connection: redis });
    const jobs = await taskQueue.getJobs(['delayed', 'waiting']);
    for (const job of jobs) {
        if (job.name === task.id) {
            await job.remove();
            break;
        }
    }
};

export const getScheduledTasks = async (redis: IORedis): Promise<Task[]> => {
    const taskQueue = new Queue('taskQueue', { connection: redis });
    const jobs = await taskQueue.getJobs(['waiting', 'delayed', 'active']);
    return jobs.map(job => job.data as Task);
};
