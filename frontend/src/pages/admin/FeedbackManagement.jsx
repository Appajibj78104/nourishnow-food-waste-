import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import axios from 'axios';

const FeedbackManagement = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [response, setResponse] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get('/api/admin/feedback');
            if (Array.isArray(response.data)) {
                setFeedbacks(response.data);
            } else {
                console.error('Expected an array but got:', response.data);
                setFeedbacks([]);
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
        }
    };

    const handleOpenDialog = (feedback) => {
        setSelectedFeedback(feedback);
        setResponse(feedback.adminResponse || '');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedFeedback(null);
        setResponse('');
    };

    const handleSubmitResponse = async () => {
        try {
            await axios.patch(`/api/admin/feedback/${selectedFeedback._id}`, { response });
            setSnackbar({ open: true, message: 'Response submitted successfully', severity: 'success' });
            fetchFeedbacks();
            handleCloseDialog();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error submitting response', severity: 'error' });
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Feedback Management
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {feedbacks.map((feedback) => (
                            <TableRow key={feedback._id}>
                                <TableCell>{feedback.user.name}</TableCell>
                                <TableCell>{feedback.type}</TableCell>
                                <TableCell>{feedback.subject}</TableCell>
                                <TableCell>
                                    {feedback.resolved ? 'Resolved' : 'Pending'}
                                </TableCell>
                                <TableCell>
                                    <Button variant="outlined" onClick={() => handleOpenDialog(feedback)}>
                                        Respond
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Respond to Feedback</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Response"
                        multiline
                        rows={4}
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmitResponse} color="primary">
                        Submit Response
                    </Button>
                </DialogActions>
            </Dialog>

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

export default FeedbackManagement; 