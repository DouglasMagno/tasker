export type TaskType = 'one-time' | 'recurring';
export type TaskHandler = 'curl' | 'default';

export interface Task {
    id: string;
    type: TaskType;
    handler: TaskHandler;
    schedule: string;
    payload: any;
    createdAt: Date;
    updatedAt: Date;
    nextExecution: Date;
}