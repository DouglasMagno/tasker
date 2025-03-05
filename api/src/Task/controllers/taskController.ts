import { Request, Response } from 'express';
import { Task } from '../models/Task';
import {scheduleTask, removeScheduledTask, getScheduledTasks} from '../services/taskScheduler';
import { v4 as uuidv4 } from 'uuid';
import { getExecutionLogs as fetchExecutionLogs } from '../../Logs/services/logService';
import {validateTaskInput} from "../validators/taskValidator";
import {getNextExecution} from "../../utils/cronParser";

export const createTask = async (req: Request, res: Response) => {
    const { type, schedule, payload } = req.body;

    const errorMsg = validateTaskInput(type, schedule);
    if (errorMsg) {
        return res.status(400).json({ message: errorMsg });
    }

    let nextExecution = new Date(schedule);
    if (type === 'recurring') {
        nextExecution = getNextExecution(schedule);
    }

    const pattern = new RegExp('^(https?:\\/\\/)?'+
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
        '((\\d{1,3}\\.){3}\\d{1,3}))'+
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
        '(\\?[;&a-z\\d%_.~+=-]*)?'+
        '(\\#[-a-z\\d_]*)?$','i');
    const isValidUrl = pattern.test(payload.message);

    const newTask: Task = {
        id: uuidv4(),
        type,
        handler: isValidUrl ? 'curl' : 'default',
        schedule,
        payload: payload || {},
        createdAt: new Date(),
        updatedAt: new Date(),
        nextExecution,
    };

    await scheduleTask(req.redis, newTask);
    res.status(201).json(newTask);
};

export const getTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await getScheduledTasks(req.redis);
        res.json(tasks);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: errorMessage });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { schedule, payload } = req.body;

    const tasks = await getScheduledTasks(req.redis);
    const task = tasks.find((t: Task) => t.id === id);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    if (schedule) {
        if (task.type === 'one-time') {
            const date = new Date(schedule);
            if (isNaN(date.getTime())) {
                return res.status(400).json({ message: 'Invalid datetime format for one-time task.' });
            }
            task.nextExecution = new Date(schedule);
        } else if (task.type === 'recurring') {
            const parts = schedule.trim().split(/\s+/);
            if (parts.length !== 5) {
                return res.status(400).json({ message: 'Invalid cron expression for recurring task.' });
            }
            try {
                task.nextExecution = getNextExecution(schedule);
            } catch (err) {
                return res.status(400).json({ message: 'Invalid cron expression for recurring task.' });
            }
        }
        task.schedule = schedule;
    }

    if (payload) {
        task.payload = payload;
    }
    task.updatedAt = new Date();

    await removeScheduledTask(req.redis, task);
    await scheduleTask(req.redis, task);
    res.status(200).json(task);
};


export const deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const tasks = await getScheduledTasks(req.redis);
    const task = tasks.find((t: Task) => t.id === id);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    await removeScheduledTask(req.redis, task);
    res.status(200).json({ message: 'Task deleted' });
};

export const getExecutionLogs = async (req: Request, res: Response) => {
    try {
        const logs = await fetchExecutionLogs(req.redis);
        res.json(logs);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: errorMessage });
    }
};
