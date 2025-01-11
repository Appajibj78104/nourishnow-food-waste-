const React = require('react');
const {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    TextField,
    Chip,
    Divider
} = require('@mui/material');
const adminService = require('../../../services/adminService');

const FeedbackDetails = ({ feedback, open, onClose, onStatusUpdate }) => {
    const [response, setResponse] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await adminService.updateFeedback(feedback._id, {
                adminResponse: response,
                status: 'resolved'
            });
            onStatusUpdate();
            onClose();
        } catch (error) {
            console.error('Error updating feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!feedback) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Feedback Details
                <Chip
                    size="small"
                    label={feedback.type}
                    color={feedback.type === 'complaint' ? 'error' : 'primary'}
                    sx={{ ml: 1 }}
                />
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                        From
                    </Typography>
                    <Typography variant="body1">
                        {feedback.user.name} ({feedback.user.email})
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                        Subject
                    </Typography>
                    <Typography variant="body1">
                        {feedback.subject}
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                        Message
                    </Typography>
                    <Typography variant="body1">
                        {feedback.message}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <TextField
                    fullWidth
                    label="Response"
                    multiline
                    rows={4}
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    disabled={feedback.status === 'resolved'}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                {feedback.status === 'pending' && (
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={loading || !response.trim()}
                    >
                        Send Response
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

module.exports = FeedbackDetails; 