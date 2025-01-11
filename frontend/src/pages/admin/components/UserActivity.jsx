const React = require('react');
const {
    Paper,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress
} = require('@mui/material');
const adminService = require('../../../services/adminService');

const UserActivity = () => {
    const [activityData, setActivityData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchActivityData();
    }, []);

    const fetchActivityData = async () => {
        try {
            const data = await adminService.getAnalytics({ type: 'user-activity' });
            setActivityData(data);
        } catch (error) {
            console.error('Error fetching user activity:', error);
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

    return (
        <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                User Activity Overview
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User Type</TableCell>
                            <TableCell align="right">Active Users</TableCell>
                            <TableCell align="right">Total Actions</TableCell>
                            <TableCell align="right">Avg. Actions/User</TableCell>
                            <TableCell align="right">Last 30 Days</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {activityData?.map((row) => (
                            <TableRow key={row.userType}>
                                <TableCell component="th" scope="row">
                                    {row.userType}
                                </TableCell>
                                <TableCell align="right">{row.activeUsers}</TableCell>
                                <TableCell align="right">{row.totalActions}</TableCell>
                                <TableCell align="right">
                                    {(row.totalActions / row.activeUsers).toFixed(2)}
                                </TableCell>
                                <TableCell align="right">{row.last30Days}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

module.exports = UserActivity; 