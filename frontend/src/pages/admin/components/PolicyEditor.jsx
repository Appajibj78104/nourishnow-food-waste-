const React = require('react');
const {
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    Grid,
    Snackbar,
    Alert,
    CircularProgress
} = require('@mui/material');
const adminService = require('../../../services/adminService');

const PolicyEditor = () => {
    const [policies, setPolicies] = React.useState({
        termsOfService: '',
        privacyPolicy: '',
        donationGuidelines: '',
        ngoGuidelines: ''
    });
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'success'
    });

    React.useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            const data = await adminService.getPolicies();
            setPolicies(data);
        } catch (error) {
            console.error('Error fetching policies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await adminService.updatePolicies(policies);
            setSnackbar({
                open: true,
                message: 'Policies updated successfully',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error updating policies',
                severity: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper elevation={2} sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Policy Editor</Typography>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Terms of Service"
                        multiline
                        rows={8}
                        value={policies.termsOfService}
                        onChange={(e) => setPolicies({
                            ...policies,
                            termsOfService: e.target.value
                        })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Privacy Policy"
                        multiline
                        rows={8}
                        value={policies.privacyPolicy}
                        onChange={(e) => setPolicies({
                            ...policies,
                            privacyPolicy: e.target.value
                        })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Donation Guidelines"
                        multiline
                        rows={6}
                        value={policies.donationGuidelines}
                        onChange={(e) => setPolicies({
                            ...policies,
                            donationGuidelines: e.target.value
                        })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="NGO Guidelines"
                        multiline
                        rows={6}
                        value={policies.ngoGuidelines}
                        onChange={(e) => setPolicies({
                            ...policies,
                            ngoGuidelines: e.target.value
                        })}
                    />
                </Grid>
            </Grid>

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

module.exports = PolicyEditor; 