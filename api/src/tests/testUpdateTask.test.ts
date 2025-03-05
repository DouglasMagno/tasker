import request from 'supertest';
import app from '../app';
import { clearQueue, taskQueue, closeQueueAndConnection } from './test-setup';

beforeEach(async () => {
    await clearQueue();
});
afterAll(async () => {
    await closeQueueAndConnection();
});

describe('Update Task API', () => {
    let taskId: string;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({
                type: 'one-time',
                schedule: '2050-03-04T14:30:00',
                payload: { message: 'Task to update' },
            });
        taskId = res.body.id;
    });

    it('should update a one-time task with valid datetime', async () => {
        const res = await request(app)
            .put(`/api/tasks/${taskId}`)
            .send({
                schedule: '2050-03-05T16:00:00',
            });
        expect(res.statusCode).toEqual(200);
        expect(new Date(res.body.nextExecution).toISOString()).toEqual(
            new Date('2050-03-05T16:00:00').toISOString()
        );
    });

    it('should update a recurring task with valid cron expression', async () => {
        const createRes = await request(app)
            .post('/api/tasks')
            .send({
                type: 'recurring',
                schedule: '0 9 * * 1-5',
                payload: { message: 'Recurring task' },
            });
        const recurringTaskId = createRes.body.id;
        const res = await request(app)
            .put(`/api/tasks/${recurringTaskId}`)
            .send({
                schedule: '30 8 * * *',
            });
        expect(res.statusCode).toEqual(200);
        expect(new Date(res.body.nextExecution).getTime()).toBeGreaterThan(Date.now());
    });

    it('should return 400 for updating a task with invalid schedule', async () => {
        const res = await request(app)
            .put(`/api/tasks/${taskId}`)
            .send({
                schedule: 'invalid-schedule',
            });
        expect(res.statusCode).toEqual(400);

        expect(res.body).toHaveProperty('message', 'Invalid datetime format for one-time task.');
    });

    it('should return 404 for updating a non-existent task', async () => {
        const res = await request(app)
            .put('/api/tasks/nonexistentid')
            .send({
                schedule: '2050-03-05T16:00:00',
            });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Task not found');
    });
});
