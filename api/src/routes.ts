import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask, getExecutionLogs } from './Task/controllers/taskController';

const router = Router();

router.post('/tasks', createTask);
router.get('/tasks', getTasks);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
router.get('/logs', getExecutionLogs);

export default router;
