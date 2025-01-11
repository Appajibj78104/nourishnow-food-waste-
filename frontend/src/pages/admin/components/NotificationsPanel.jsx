import React from 'react';
import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Box,
    Badge
} from '@mui/material';
import {
    Notifications as NotificationIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const getNotificationIcon = (type) => {
    switch (type) {
        case 'error':
            return <ErrorIcon color="error" />;
        case 'warning':
            return <WarningIcon color="warning" />;
        default:
            return <InfoIcon color="info" />;
    }
};

const NotificationsPanel = ({ notifications }) => {
    return (
        <Paper elevation={2} sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">
                    Notifications
                </Typography>
                <Badge badgeContent={notifications.length} color="error">
                    <NotificationIcon color="action" />
                </Badge>
            </Box>
            <List>
                {notifications.map((notification) => (
                    <ListItem
                        key={notification._id}
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete">
                                <CloseIcon />
                            </IconButton>
                        }
                    >
                        <ListItemIcon>
                            {getNotificationIcon(notification.type)}
                        </ListItemIcon>
                        <ListItemText
                            primary={notification.message}
                            secondary={formatDistanceToNow(new Date(notification.createdAt)) + ' ago'}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default NotificationsPanel; 