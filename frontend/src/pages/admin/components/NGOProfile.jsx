const React = require('react');
const {
    Paper,
    Grid,
    Typography,
    Box,
    Chip,
    List,
    ListItem,
    ListItemText,
    Divider
} = require('@mui/material');
const {
    LocationOn,
    Phone,
    Email,
    Business
} = require('@mui/icons-material');

const NGOProfile = ({ ngo }) => {
    return (
        <Paper elevation={2} sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5">{ngo.name}</Typography>
                        <Chip
                            label={ngo.verificationStatus}
                            color={ngo.verificationStatus === 'verified' ? 'success' : 'warning'}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle1" color="textSecondary">
                        Registration Details
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="Registration Number"
                                secondary={ngo.registrationNumber}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary="Registration Date"
                                secondary={new Date(ngo.createdAt).toLocaleDateString()}
                            />
                        </ListItem>
                    </List>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle1" color="textSecondary">
                        Contact Information
                    </Typography>
                    <List>
                        <ListItem>
                            <Business sx={{ mr: 2 }} />
                            <ListItemText primary={ngo.address} />
                        </ListItem>
                        <ListItem>
                            <Phone sx={{ mr: 2 }} />
                            <ListItemText primary={ngo.phone} />
                        </ListItem>
                        <ListItem>
                            <Email sx={{ mr: 2 }} />
                            <ListItemText primary={ngo.email} />
                        </ListItem>
                        <ListItem>
                            <LocationOn sx={{ mr: 2 }} />
                            <ListItemText primary={`${ngo.address.city}, ${ngo.address.state}`} />
                        </ListItem>
                    </List>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle1" color="textSecondary">
                        Activity Summary
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6} md={3}>
                            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="h6">{ngo.stats.totalDonations}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Total Donations
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="h6">{ngo.stats.activeDonations}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Active Donations
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="h6">{ngo.stats.completedDonations}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Completed Donations
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="h6">{ngo.stats.totalBeneficiaries}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Beneficiaries Served
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

module.exports = NGOProfile; 