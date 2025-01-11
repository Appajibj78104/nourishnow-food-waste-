import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import {
    Timeline,
    TrendingUp,
    People,
    LocalShipping
} from '@mui/icons-material';
import { getSocket } from '../../../services/adminSocketService';

const RealTimeMetric = ({ title, value, icon, color }) => (
    <Paper 
        elevation={2} 
        sx={{ 
            p: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }}
    >
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
                <Typography color="textSecondary" variant="subtitle2">
                    {title}
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, color }}>
                    {value}
                </Typography>
            </Box>
            <Box 
                sx={{ 
                    backgroundColor: `${color}15`, 
                    p: 1, 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {icon}
            </Box>
        </Box>
    </Paper>
);

const RealTimeAnalytics = () => {
    const [metrics, setMetrics] = React.useState({
        activeUsers: 0,
        activeDonations: 0,
        pendingDeliveries: 0,
        recentTransactions: []
    });

    React.useEffect(() => {
        let socket;
        try {
            socket = getSocket();
            if (socket) {
                socket.on('realTimeMetrics', (data) => {
                    setMetrics(prevMetrics => ({
                        ...prevMetrics,
                        ...data
                    }));
                });
                socket.emit('getMetrics');
            }
        } catch (error) {
            console.error('Socket connection error:', error);
        }

        return () => {
            if (socket) {
                socket.off('realTimeMetrics');
            }
        };
    }, []);

    const realTimeMetrics = [
        {
            title: 'Active Users',
            value: metrics.activeUsers || 0,
            icon: <People sx={{ color: '#2196f3', fontSize: 24 }} />,
            color: '#2196f3'
        },
        {
            title: 'Active Donations',
            value: metrics.activeDonations || 0,
            icon: <TrendingUp sx={{ color: '#4caf50', fontSize: 24 }} />,
            color: '#4caf50'
        },
        {
            title: 'Pending Deliveries',
            value: metrics.pendingDeliveries || 0,
            icon: <LocalShipping sx={{ color: '#ff9800', fontSize: 24 }} />,
            color: '#ff9800'
        },
        {
            title: 'Recent Activity',
            value: (metrics.recentTransactions || []).length,
            icon: <Timeline sx={{ color: '#f50057', fontSize: 24 }} />,
            color: '#f50057'
        }
    ];

    return (
        <Box sx={{ width: '100%', mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {realTimeMetrics.map((metric, index) => (
                <Box 
                    key={index} 
                    sx={{ flex: '1 1 calc(25% - 16px)', boxSizing: 'border-box' }} // Adjust width as needed
                >
                    <RealTimeMetric {...metric} />
                </Box>
            ))}
        </Box>
    );
};

export default RealTimeAnalytics; 