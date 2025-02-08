import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    Switch,
    FormControlLabel,
    Button,
    Divider,
    Alert,
    Snackbar
} from '@mui/material';
import axios from 'axios';

const Settings = () => {
    const [settings, setSettings] = useState({
        donationExpiryHours: 24,
        autoAssignNGOs: true,
        maxDonationDistance: 10,
        enableNotifications: false,
        requireVerification: false,
        minimumDonationQuantity: 10,
        systemMaintenanceMode: false
    });
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get('/api/admin/settings');
            if (response.data) {    // Check if response.data is an object
                setSettings(response.data);
            } else {
                console.error('Expected an object but got:', response.data);
                setSettings({});
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setLoading(false);
        }
    };

    const handleChange = (name, value) => {
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch('/api/admin/settings', settings);
            setSnackbar({
                open: true,
                message: 'Settings updated successfully',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error updating settings',
                severity: 'error'
            });
        }
    };

    if (loading) {
        return <Box>Loading...</Box>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                System Settings
            </Typography>

            <Paper sx={{ p: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid2 container spacing={3}>
                        {/* Donation Settings */}
                        <Grid2>
                            <Typography variant="h6" gutterBottom>
                                Donation Settings
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid2>

                        <Grid2 >
                            <TextField
                                fullWidth
                                label="Donation Expiry Hours"
                                type="number"
                                value={settings.donationExpiryHours || 24}
                                onChange={(e) => handleChange('donationExpiryHours', Number(e.target.value))}
                            />
                        </Grid2>

                        <Grid2 >
                            <TextField
                                fullWidth
                                label="Maximum Donation Distance (km)"
                                type="number"
                                value={settings.maxDonationDistance || 10}
                                onChange={(e) => handleChange('maxDonationDistance', Number(e.target.value))}
                            />
                        </Grid2>

                        {/* System Settings */}
                        <Grid2 >
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                System Settings
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid2>

                        <Grid2 >
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={Boolean(settings.autoAssignNGOs)}
                                        onChange={(e) => handleChange('autoAssignNGOs', e.target.checked)}
                                    />
                                }
                                label="Auto-assign NGOs"
                            />
                        </Grid2>

                        <Grid2 >
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={Boolean(settings.enableNotifications)}
                                        onChange={(e) => handleChange('enableNotifications', e.target.checked)}
                                    />
                                }
                                label="Enable Notifications"
                            />
                        </Grid2>

                        <Grid2 >
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={Boolean(settings.requireVerification)}
                                        onChange={(e) => handleChange('requireVerification', e.target.checked)}
                                    />
                                }
                                label="Require NGO Verification"
                            />
                        </Grid2>

                        <Grid2 >
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={Boolean(settings.systemMaintenanceMode)}
                                        onChange={(e) => handleChange('systemMaintenanceMode', e.target.checked)}
                                    />
                                }
                                label="System Maintenance Mode"
                            />
                        </Grid2>

                        <Grid2 >
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                            >
                                Save Settings
                            </Button>
                        </Grid2>
                    </Grid2>
                </form>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Settings; 