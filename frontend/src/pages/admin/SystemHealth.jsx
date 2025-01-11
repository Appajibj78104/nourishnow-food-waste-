import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    CircularProgress,
    Alert
} from '@mui/material';
import axios from 'axios';

const SystemHealth = () => {
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHealth();
    }, []);

    const fetchHealth = async () => {
        try {
            const response = await axios.get('/api/admin/system/health');
            setHealth(response.data);
        } catch (error) {
            setError('Error fetching system health');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                System Health
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6">Database Connection: {health.database ? 'Connected' : 'Disconnected'}</Typography>
                <Typography variant="h6">Server Status: {health.server ? 'Running' : 'Down'}</Typography>
                <Typography variant="h6">CPU Usage: {health.metrics.cpu.user} %</Typography>
                <Typography variant="h6">Memory Usage: {health.metrics.memory.heapUsed / 1024 / 1024} MB</Typography>
                <Typography variant="h6">Uptime: {health.metrics.uptime} seconds</Typography>
            </Paper>
        </Box>
    );
};

export default SystemHealth; 