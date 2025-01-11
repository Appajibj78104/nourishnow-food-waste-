import React from 'react';
import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Box
} from '@mui/material';
import {
    Restaurant as DonationIcon,
    LocalHospital as NGOIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const RecentActivity = ({ activities = {} }) => {
    const { recentDonations = [], recentNGOs = [] } = activities;

    return (
        <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Recent Activity
            </Typography>
            <List>
                {recentDonations.map((donation, index) => (
                    <React.Fragment key={donation._id}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: 'warning.main' }}>
                                    <DonationIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={`New Donation from ${donation.donor.name}`}
                                secondary={
                                    <Box component="span">
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {`${donation.foodType} - ${donation.quantity} ${donation.quantityUnit}`}
                                        </Typography>
                                        {` — ${formatDistanceToNow(new Date(donation.createdAt))} ago`}
                                    </Box>
                                }
                            />
                        </ListItem>
                        {index < recentDonations.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                ))}

                {recentNGOs.map((ngo, index) => (
                    <React.Fragment key={ngo._id}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                    <NGOIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={`New NGO Registration: ${ngo.name}`}
                                secondary={
                                    <Box component="span">
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {ngo.user.name}
                                        </Typography>
                                        {` — ${formatDistanceToNow(new Date(ngo.createdAt))} ago`}
                                    </Box>
                                }
                            />
                        </ListItem>
                        {index < recentNGOs.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );
};

export default RecentActivity; 