import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import {
    People as PeopleIcon,
    LocalHospital as NGOIcon,
    Restaurant as DonationIcon,
    Pending as PendingIcon
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
    <Paper elevation={2} sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
                <Typography variant="subtitle2" color="textSecondary">
                    {title}
                </Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                    {value}
                </Typography>
            </Box>
            <Box 
                sx={{ 
                    backgroundColor: `${color}20`, 
                    p: 1, 
                    borderRadius: 2 
                }}
            >
                {icon}
            </Box>
        </Box>
    </Paper>
);

const DashboardStats = ({ stats }) => {
    const statItems = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: <PeopleIcon sx={{ color: 'primary.main' }} />,
            color: '#1976d2'
        },
        {
            title: 'Verified NGOs',
            value: stats.totalNGOs,
            icon: <NGOIcon sx={{ color: 'success.main' }} />,
            color: '#2e7d32'
        },
        {
            title: 'Active Donations',
            value: stats.activeDonations,
            icon: <DonationIcon sx={{ color: 'warning.main' }} />,
            color: '#ed6c02'
        },
        {
            title: 'Pending Verifications',
            value: stats.pendingVerifications,
            icon: <PendingIcon sx={{ color: 'error.main' }} />,
            color: '#d32f2f'
        }
    ];

    return (
        <Grid container spacing={3}>
            {statItems.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <StatCard {...item} />
                </Grid>
            ))}
        </Grid>
    );
};

export default DashboardStats; 