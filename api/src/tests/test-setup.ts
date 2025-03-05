import { Queue } from 'bullmq';
import redisConnection from '../redis/redis';

process.env.NODE_ENV = 'test';

async function safeQuit(conn: any) {
  try {
    await conn.quit();
  } catch (error: any) {
    if (error.message.includes("Stream isn't writeable")) {
      console.warn('Ignoring quit error:', error.message);
    } else {
      throw error;
    }
  } finally {
    conn.disconnect();
  }
}

export const taskQueue = new Queue('taskQueue', { connection: redisConnection });

export const clearQueue = async () => {
  await taskQueue.drain();
  await taskQueue.clean(0, 999, 'active');
};

export const closeQueueAndConnection = async () => {
  await taskQueue.close();
  await safeQuit(redisConnection);
};
