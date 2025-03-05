import request from 'supertest';
import app from '../app';
import { clearQueue, taskQueue, closeQueueAndConnection } from './test-setup';

beforeEach(async () => {
    await clearQueue();
});
afterAll(async () => {
    await closeQueueAndConnection();
});

describe('Get Tasks API', () => {
    it('should return an array of tasks when tasks exist', async () => {
        const createRes = await request(app)
            .post('/api/tasks')
            .send({
                type: 'one-time',
                schedule: '2050-03-04T14:30:00',
                payload: { message: 'Test Task' },
            });
        expect(createRes.statusCode).toEqual(201);
        const res = await request(app).get('/api/tasks');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        const task = res.body.find((t: any) => t.id === createRes.body.id);
        expect(task).toBeDefined();
    });

    it('should include a newly created task in the task list', async () => {
        const createRes = await request(app)
            .post('/api/tasks')
            .send({
                type: 'one-time',
                schedule: '2050-03-04T14:30:00',
                payload: { message: 'New Task' },
            });
        expect(createRes.statusCode).toEqual(201);
        const res = await request(app).get('/api/tasks');
        const task = res.body.find((t: any) => t.id === createRes.body.id);
        expect(task).toBeDefined();
    });

    it('should not return a deleted task', async () => {
        const createRes = await request(app)
            .post('/api/tasks')
            .send({
                type: 'one-time',
                schedule: '2050-03-04T14:30:00',
                payload: { message: 'To be deleted' },
            });
        expect(createRes.statusCode).toEqual(201);
        const taskId = createRes.body.id;
        await request(app).delete(`/api/tasks/${taskId}`);
        const res = await request(app).get('/api/tasks');
        const task = res.body.find((t: any) => t.id === taskId);
        expect(task).toBeUndefined();
    });
});
