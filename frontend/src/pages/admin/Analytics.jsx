import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Tab,
    Tabs,
    CircularProgress
} from '@mui/material';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import axios from 'axios';

const Analytics = () => {
    const [tab, setTab] = useState(0);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [tab]);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get(`/api/admin/analytics/${getEndpoint()}`);
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setLoading(false);
        }
    };

    const getEndpoint = () => {
        switch (tab) {
            case 0: return 'overview';
            case 1: return 'users';
            case 2: return 'donations';
            case 3: return 'ngos';
            default: return 'overview';
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
                Analytics Dashboard
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
                    <Tab label="Overview" />
                    <Tab label="User Analytics" />
                    <Tab label="Donation Analytics" />
                    <Tab label="NGO Analytics" />
                </Tabs>
            </Box>

            <Grid container spacing={3}>
                {/* Overview Charts */}
                {tab === 0 && (
                    <>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Overall Activity
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={data?.activityData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="users" stroke="#8884d8" />
                                        <Line type="monotone" dataKey="donations" stroke="#82ca9d" />
                                        <Line type="monotone" dataKey="ngos" stroke="#ffc658" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Success Metrics
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={data?.successMetrics}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                    </>
                )}

                {/* User Analytics */}
                {tab === 1 && (
                    // User-specific analytics components
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                User Growth & Engagement
                            </Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={data?.userMetrics}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="newUsers" stroke="#8884d8" />
                                    <Line type="monotone" dataKey="activeUsers" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                )}

                {/* Similar sections for Donation and NGO Analytics */}
            </Grid>
        </Box>
    );
};

export default Analytics; 