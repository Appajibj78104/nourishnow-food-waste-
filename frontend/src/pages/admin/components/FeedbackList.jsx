const React = require('react');
const {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    IconButton,
    Typography,
    Box
} = require('@mui/material');
const {
    Visibility,
    Flag,
    CheckCircle
} = require('@mui/icons-material');
const adminService = require('../../../services/adminService');

const FeedbackList = ({ onViewFeedback }) => {
    const [feedback, setFeedback] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [total, setTotal] = React.useState(0);

    React.useEffect(() => {
        fetchFeedback();
    }, [page, rowsPerPage]);

    const fetchFeedback = async () => {
        try {
            const data = await adminService.getFeedback({
                page: page + 1,
                limit: rowsPerPage
            });
            setFeedback(data.feedback);
            setTotal(data.total);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            pending: { color: 'warning', icon: <Flag fontSize="small" /> },
            resolved: { color: 'success', icon: <CheckCircle fontSize="small" /> }
        };

        return (
            <Chip
                size="small"
                label={status}
                color={statusConfig[status].color}
                icon={statusConfig[status].icon}
            />
        );
    };

    return (
        <Paper elevation={2} sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">User Feedback</Typography>
            </Box>
            
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {feedback.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item.user.name}</TableCell>
                                <TableCell>
                                    <Chip
                                        size="small"
                                        label={item.type}
                                        color={item.type === 'complaint' ? 'error' : 'primary'}
                                    />
                                </TableCell>
                                <TableCell>{item.subject}</TableCell>
                                <TableCell>
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{getStatusChip(item.status)}</TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() => onViewFeedback(item)}
                                        color="primary"
                                    >
                                        <Visibility />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
            />
        </Paper>
    );
};

module.exports = FeedbackList; 