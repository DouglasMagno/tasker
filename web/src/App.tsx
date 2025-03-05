import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ExecutionLog from './components/ExecutionLog';
import { Container, Typography, Box } from '@mui/material';

const App: React.FC = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

    const fetchTasks = async () => {
        const response = await axios.get(`${backendUrl}/tasks`);
        setTasks(response.data);
    };

    const fetchLogs = async () => {
        const response = await axios.get(`${backendUrl}/logs`);
        setLogs(response.data);
    };

    useEffect(() => {
        fetchTasks();
        fetchLogs();
        const interval = setInterval(() => {
            fetchTasks();
            fetchLogs();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h3" align="center" gutterBottom>
                Distributed Task Scheduler
            </Typography>
            <Box sx={{ my: 4 }}>
                <TaskForm onTaskCreated={fetchTasks} backendUrl={backendUrl} />
            </Box>
            <Box sx={{ my: 4 }}>
                <TaskList tasks={tasks} onTaskUpdated={fetchTasks} backendUrl={backendUrl} />
            </Box>
            <Box sx={{ my: 4 }}>
                <ExecutionLog logs={logs} />
            </Box>
        </Container>
    );
};

export default App;
