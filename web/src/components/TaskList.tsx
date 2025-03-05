import React from 'react';
import axios from 'axios';
import { Box, Button, List, ListItem, Typography, Paper } from '@mui/material';

interface TaskListProps {
    tasks: any[];
    onTaskUpdated: () => void;
    backendUrl: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskUpdated, backendUrl }) => {
    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`${backendUrl}/tasks/${id}`);
            onTaskUpdated();
        } catch (error) {
            console.error('Error deleting task', error);
        }
    };

    const handleEdit = async (id: string, currentSchedule: string) => {
        const newSchedule = prompt('Enter new schedule:', currentSchedule);
        if (newSchedule) {
            try {
                await axios.put(`${backendUrl}/tasks/${id}`, { schedule: newSchedule });
                onTaskUpdated();
            } catch (error) {
                console.error('Error updating task', error);
            }
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Scheduled Tasks
            </Typography>
            {tasks.length === 0 ? (
                <Typography>No tasks scheduled.</Typography>
            ) : (
                <List>
                    {tasks.map(task => (
                        <ListItem key={task.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="subtitle1">ID: {task.id}</Typography>
                                <Typography variant="subtitle1">{task.type}</Typography>
                                <Typography variant="body2">Schedule: {task.schedule}</Typography>
                                <Typography variant="body2">Payload: {JSON.stringify(task.payload)}</Typography>
                                <Typography variant="body2">
                                    Next Execution: {new Date(task.nextExecution).toLocaleString()}
                                </Typography>
                            </Box>
                            <Box>
                                <Button variant="outlined" size="small" onClick={() => handleEdit(task.id, task.schedule)} sx={{ mr: 1 }}>
                                    Edit
                                </Button>
                                <Button variant="contained" size="small" color="error" onClick={() => handleDelete(task.id)}>
                                    Delete
                                </Button>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default TaskList;
