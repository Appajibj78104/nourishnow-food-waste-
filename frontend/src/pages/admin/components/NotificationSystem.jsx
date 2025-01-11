const React = require('react');
const {
    Drawer,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Badge,
    Divider,
    Button
} = require('@mui/material');
const {
    Notifications,
    Error,
    Warning,
    Info,
    Close
} = require('@mui/icons-material');
const { format } = require('date-fns');
const adminSocketService = require('../../../services/adminSocketService');

const NotificationSystem = () => {
    const [open, setOpen] = React.useState(false);
    const [notifications, setNotifications] = React.useState([]);
    const [unreadCount, setUnreadCount] = React.useState(0);

    React.useEffect(() => {
        const socket = adminSocketService.getSocket();

        socket.on('adminNotification', (notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        return () => {
            socket.off('adminNotification');
        };
    }, []);

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            setUnreadCount(prev => prev - 1);
            notification.read = true;
        }
        // Handle notification action based on type
        switch (notification.type) {
            case 'ngo_verification':
                // Navigate to NGO verification page
                break;
            case 'user_report':
                // Open user report modal
                break;
            case 'system_alert':
                // Show system alert details
                break;
            default:
                break;
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'error':
                return <Error color="error" />;
            case 'warning':
                return <Warning color="warning" />;
            default:
                return <Info color="info" />;
        }
    };

    return (
        <>
            <IconButton color="inherit" onClick={() => setOpen(true)}>
                <Badge badgeContent={unreadCount} color="error">
                    <Notifications />
                </Badge>
            </IconButton>

            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
            >
                <Box sx={{ width: 350, p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Notifications</Typography>
                        <IconButton onClick={() => setOpen(false)}>
                            <Close />
                        </IconButton>
                    </Box>

                    <List>
                        {notifications.map((notification, index) => (
                            <React.Fragment key={notification.id}>
                                <ListItem
                                    button
                                    onClick={() => handleNotificationClick(notification)}
                                    sx={{
                                        bgcolor: notification.read ? 'transparent' : 'action.hover'
                                    }}
                                >
                                    <ListItemIcon>
                                        {getNotificationIcon(notification.type)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={notification.message}
                                        secondary={format(new Date(notification.timestamp), 'PPp')}
                                    />
                                </ListItem>
                                {index < notifications.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>

                    {notifications.length > 0 && (
                        <Box mt={2} display="flex" justifyContent="center">
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setNotifications([]);
                                    setUnreadCount(0);
                                }}
                            >
                                Clear All
                            </Button>
                        </Box>
                    )}
                </Box>
            </Drawer>
        </>
    );
};

module.exports = NotificationSystem; 