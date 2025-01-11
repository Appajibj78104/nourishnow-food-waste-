import React from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from 'recharts';
import{getSocket, } from '../../../services/adminSocketService';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardWidgets = () => {
    const [data, setData] = React.useState({
        donationStats: [],
        userStats: [],
        ngoStats: [],
        loading: true
    });

    React.useEffect(() => {
        const socket = getSocket();

        socket.on('dashboardStats', (newData) => {
            setData(prev => ({
                ...prev,
                ...newData,
                loading: false
            }));
        });

        // Request initial data
        socket.emit('getDashboardStats');

        return () => {
            socket.off('dashboardStats');
        };
    }, []);

    if (data.loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {/* Donation Distribution Widget */}
            <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2, height: 300 }}>
                    <Typography variant="h6" gutterBottom>
                        Donation Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.donationStats}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {data.donationStats.map((entry, index) => (
                                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>

            {/* User Activity Widget */}
            <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2, height: 300 }}>
                    <Typography variant="h6" gutterBottom>
                        User Activity
                    </Typography>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.userStats}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="active" fill="#8884d8" />
                            <Bar dataKey="new" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>

            {/* NGO Performance Widget */}
            <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 2, height: 300 }}>
                    <Typography variant="h6" gutterBottom>
                        NGO Performance
                    </Typography>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.ngoStats}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="donations" fill="#8884d8" />
                            <Bar dataKey="deliveries" fill="#82ca9d" />
                            <Bar dataKey="impact" fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default DashboardWidgets; 