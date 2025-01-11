const React = require('react');
const {
    Paper,
    Typography,
    Box,
    TextField,
    Switch,
    FormControlLabel,
    Button,
    Divider,
    Grid,
    Alert,
    Snackbar
} = require('@mui/material');
const adminService = require('../../../services/adminService');

const SettingsPanel = () => {
    const [settings, setSettings] = React.useState({
        donationExpiryHours: 24,
        autoAssignNGOs: true,
        maxDonationDistance: 10,
        enableNotifications: true,
        requireVerification: true,
        minimumDonationQuantity: 1
    });
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await adminService.getSystemSettings();
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const handleChange = (name) => (event) => {
        setSettings({
            ...settings,
            [name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            await adminService.updateSystemSettings(settings);
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                System Settings
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Donation Expiry (hours)"
                            type="number"
                            value={settings.donationExpiryHours}
                            onChange={handleChange('donationExpiryHours')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Maximum Donation Distance (km)"
                            type="number"
                            value={settings.maxDonationDistance}
                            onChange={handleChange('maxDonationDistance')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Minimum Donation Quantity"
                            type="number"
                            value={settings.minimumDonationQuantity}
                            onChange={handleChange('minimumDonationQuantity')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.autoAssignNGOs}
                                    onChange={handleChange('autoAssignNGOs')}
                                />
                            }
                            label="Auto-assign NGOs to Donations"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.enableNotifications}
                                    onChange={handleChange('enableNotifications')}
                                />
                            }
                            label="Enable System Notifications"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.requireVerification}
                                    onChange={handleChange('requireVerification')}
                                />
                            }
                            label="Require NGO Verification"
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        Save Changes
                    </Button>
                </Box>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

module.exports = SettingsPanel; 