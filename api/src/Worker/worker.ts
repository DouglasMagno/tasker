import { Worker, Job } from 'bullmq';
import axios from 'axios';
import { Task } from '../Task/models/Task';
import { getNextExecution } from '../utils/cronParser';
import { scheduleTask } from '../Task/services/taskScheduler';
import { addExecutionLog } from '../Logs/services/logService';
import os from 'os';
import redisConnection from '../redis/redis';

const connection = redisConnection;
connection.once('connect', () => {
    console.log(`Container ${os.hostname()} connected to redis!`);
})

const worker = new Worker(
    'taskQueue',
    async (job: Job) => {
        const task: Task = job.data;

        // TODO: could be a handler for a specific queue for a specific worker
        if (task.handler === 'curl') {
            const response = await axios.get(task.payload.message);
            console.log(`Executing curl task ${task.id} at ${new Date().toISOString()} processed by ${job.processedBy} container Id`, task.payload, response.data);
            await addExecutionLog(connection, {
                taskId: task.id,
                executedAt: new Date().toISOString(),
                payload: {
                    payload: task.payload,
                    response: response.data,
                }
            });
        } else {
            console.log(`Executing task ${task.id} at ${new Date().toISOString()} processed by ${job.processedBy} container Id`, task.payload);
            await addExecutionLog(connection, {
                taskId: task.id,
                executedAt: new Date().toISOString(),
                payload: task.payload
            });
        }

        if (task.type === 'recurring') {
            task.nextExecution = getNextExecution(task.schedule);
            await scheduleTask(connection, task);
        }
    },
    { connection, name: os.hostname() }
);

worker.on('completed', job => {
    const task: Task = job.data;
    console.log(`Job ${task.id} completed by ${os.hostname()}`);
});

worker.on('failed', (job, err) => {
    const task: Task = job?.data;
    console.error(`Job ${task?.id} failed: ${err} by ${os.hostname()}`);
});

console.log(`Worker ${os.hostname()} started and listening for tasks.`);

export {};
