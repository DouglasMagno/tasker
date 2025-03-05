import React from 'react';
import { Box, List, ListItem, Typography, Paper } from '@mui/material';

interface ExecutionLogProps {
    logs: any[];
}

const ExecutionLog: React.FC<ExecutionLogProps> = ({ logs }) => {
    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Execution Logs
            </Typography>
            {logs.length === 0 ? (
                <Typography>No logs available.</Typography>
            ) : (
                <List>
                    {logs.map((log, index) => (
                        <ListItem key={index}>
                            <Typography variant="body2">
                                Task ID: {log.taskId} | Executed at: {new Date(log.executedAt).toLocaleString()} | Payload: {JSON.stringify(log.payload)}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default ExecutionLog;
