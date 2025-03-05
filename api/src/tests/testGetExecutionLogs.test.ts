import request from 'supertest';
import app from '../app';
import { clearQueue, taskQueue, closeQueueAndConnection } from './test-setup';

beforeEach(async () => {
    await clearQueue();
});
afterAll(async () => {
    await closeQueueAndConnection();
});

describe('Get Execution Logs API', () => {
    it('should retrieve logs after a one-time task execution', async () => {
        const futureDate = new Date(Date.now() + 2000).toISOString();
        const createRes = await request(app)
            .post('/api/tasks')
            .send({
                type: 'one-time',
                schedule: futureDate,
                payload: { message: 'Log Test' },
            });
        expect(createRes.statusCode).toEqual(201);

        await new Promise((resolve) => setTimeout(resolve, 3000));

        const res = await request(app).get('/api/logs');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        const log = res.body.find((l: any) => l.taskId === createRes.body.id);
        expect(log).toBeDefined();
    });

    it('should return 500 if there is an error retrieving logs', async () => {
        const logService = require('../Logs/services/logService');
        jest.spyOn(logService, 'getExecutionLogs').mockImplementationOnce(() => {
            throw new Error('Redis error');
        });

        const res = await request(app).get('/api/logs');
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error', 'Redis error');
    });
});
