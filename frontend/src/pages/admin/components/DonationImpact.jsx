import React from 'react';
import {
    Paper,
    Grid,
    Typography,
    Box,
    CircularProgress
} from '@mui/material';
import {
    RestaurantMenu,
    People,
    DeleteOutline,
    TrendingUp
} from '@mui/icons-material';
import adminService from '../../../services/adminService';

const ImpactCard = ({ title, value, icon, color }) => (
    <Paper elevation={2} sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
                <Typography color="textSecondary" variant="subtitle2">
                    {title}
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, color: color }}>
                    {value}
                </Typography>
            </Box>
            <Box sx={{ backgroundColor: `${color}15`, p: 1, borderRadius: 2 }}>
                {icon}
            </Box>
        </Box>
    </Paper>
);

const DonationImpact = () => {
    const [impactData, setImpactData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchImpactData();
    }, []);

    const fetchImpactData = async () => {
        try {
            const data = await adminService.getDonationStats();
            setImpactData(data);
        } catch (error) {
            console.error('Error fetching impact data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    const impactCards = [
        {
            title: 'Total Meals Served',
            value: impactData?.totalMeals || 0,
            icon: <RestaurantMenu sx={{ color: '#2196f3' }} />,
            color: '#2196f3'
        },
        {
            title: 'People Benefited',
            value: impactData?.peopleBenefited || 0,
            icon: <People sx={{ color: '#4caf50' }} />,
            color: '#4caf50'
        },
        {
            title: 'Food Waste Reduced (kg)',
            value: impactData?.wasteReduced || 0,
            icon: <DeleteOutline sx={{ color: '#ff9800' }} />,
            color: '#ff9800'
        },
        {
            title: 'Monthly Growth',
            value: `${impactData?.monthlyGrowth || 0}%`,
            icon: <TrendingUp sx={{ color: '#f50057' }} />,
            color: '#f50057'
        }
    ];

    return (
        <Grid container spacing={3}>
            {impactCards.map((card, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <ImpactCard {...card} />
                </Grid>
            ))}
        </Grid>
    );
};

export default DonationImpact; 