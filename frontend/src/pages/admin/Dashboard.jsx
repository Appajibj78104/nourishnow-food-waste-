import React from 'react';
import {  Paper, Typography, Box } from '@mui/material';
import RealTimeAnalytics from './components/RealTimeAnalytics'; 
import DashboardWidgets from './components/DashboardWidgets';
import RecentActivity from './components/RecentActivity';

const Dashboard = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>
            
            <Box sx={{ width: '100%', mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {/* Real-time Analytics */}
                <Box sx={{ flex: '1 1 calc(25% - 16px)', boxSizing: 'border-box' }}>
                    <Paper sx={{ p: 2 }}>
                        <RealTimeAnalytics />
                    </Paper>
                </Box>

                {/* Dashboard Widgets */}
                <Box sx={{ flex: '1 1 calc(25% - 16px)', boxSizing: 'border-box' }}>
                    <Paper sx={{ p: 2 }}>
                        <DashboardWidgets />
                    </Paper>
                </Box>

                {/* Recent Activity */}
                <Box sx={{ flex: '1 1 calc(25% - 16px)', boxSizing: 'border-box' }}>
                    <Paper sx={{ p: 2 }}>
                        <RecentActivity />
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard; 