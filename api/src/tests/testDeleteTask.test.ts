import request from 'supertest';
import app from '../app';
import { clearQueue, taskQueue, closeQueueAndConnection } from './test-setup';

beforeEach(async () => {
    await clearQueue();
});
afterAll(async () => {
    await closeQueueAndConnection();
});

describe('Delete Task API', () => {
    let taskId: string;

    beforeEach(async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({
                type: 'one-time',
                schedule: '2050-03-04T14:30:00',
                payload: { message: 'Task to delete' },
            });
        taskId = res.body.id;
    });

    it('should delete an existing task successfully', async () => {
        const res = await request(app).delete(`/api/tasks/${taskId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Task deleted');
    });

    it('should return 404 for deleting a non-existent task', async () => {
        const res = await request(app).delete('/api/tasks/nonexistentid');
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Task not found');
    });
});
