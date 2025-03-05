import request from 'supertest';
import app from '../app';
import { clearQueue, taskQueue, closeQueueAndConnection } from './test-setup';

beforeEach(async () => {
    await clearQueue();
});
afterAll(async () => {
    await closeQueueAndConnection();
});

describe('Create Task API', () => {
    it('should create a one-time task with valid datetime', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({
                type: 'one-time',
                schedule: '2050-03-04T14:30:00',
                payload: { message: 'Meeting' },
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(new Date(res.body.nextExecution).toISOString()).toEqual(
            new Date('2050-03-04T14:30:00').toISOString()
        );
    });

    it('should create a recurring task with valid cron expression', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({
                type: 'recurring',
                schedule: '0 9 * * 1-5',
                payload: { message: 'Daily reminder' },
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(new Date(res.body.nextExecution).getTime()).toBeGreaterThan(Date.now());
    });

    it('should return 400 for one-time task with invalid datetime', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({
                type: 'one-time',
                schedule: 'invalid-datetime',
                payload: { message: 'Invalid Date' },
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Invalid datetime format for one-time task.');
    });

    it('should return 400 for recurring task with invalid cron expression', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({
                type: 'recurring',
                schedule: '* * *',
                payload: { message: 'Invalid Cron' },
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Invalid cron expression for recurring task.');
    });
});
