import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, MenuItem, Typography, Paper } from '@mui/material';

interface TaskFormProps {
    onTaskCreated: () => void;
    backendUrl: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated, backendUrl }) => {
    const [type, setType] = useState<'one-time' | 'recurring'>('one-time');
    const [schedule, setSchedule] = useState('');
    const [payload, setPayload] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${backendUrl}/tasks`, {
                type,
                schedule,
                payload: { message: payload },
            });
            onTaskCreated();
            setSchedule('');
            setPayload('');
            setError(null);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.message);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Create Task
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    select
                    label="Type"
                    value={type}
                    onChange={(e) => setType(e.target.value as 'one-time' | 'recurring')}
                    fullWidth
                >
                    <MenuItem value="one-time">One-time</MenuItem>
                    <MenuItem value="recurring">Recurring (Cron)</MenuItem>
                </TextField>
                <TextField
                    label="Schedule"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    placeholder={type === 'one-time' ? 'YYYY-MM-DDTHH:MM:SS' : 'Cron expression'}
                    fullWidth
                />
                <TextField
                    label="Payload (Message)"
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                    fullWidth
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button variant="contained" type="submit">
                    Create Task
                </Button>
            </Box>
        </Paper>
    );
};

export default TaskForm;
