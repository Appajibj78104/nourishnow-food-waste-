const React = require('react');
const {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} = require('@mui/material');
const adminService = require('../../../services/adminService');

const VerificationRequests = () => {
    const [requests, setRequests] = React.useState([]);
    const [selectedNGO, setSelectedNGO] = React.useState(null);
    const [remarks, setRemarks] = React.useState('');
    const [dialogOpen, setDialogOpen] = React.useState(false);

    React.useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await adminService.getNGOVerificationRequests();
            setRequests(data);
        } catch (error) {
            console.error('Error fetching verification requests:', error);
        }
    };

    const handleVerify = async (status) => {
        try {
            await adminService.verifyNGO(selectedNGO._id, { status, remarks });
            setDialogOpen(false);
            setSelectedNGO(null);
            setRemarks('');
            fetchRequests();
        } catch (error) {
            console.error('Error updating NGO verification:', error);
        }
    };

    return (
        <>
            <Paper elevation={2} sx={{ p: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>NGO Name</TableCell>
                                <TableCell>Registration Number</TableCell>
                                <TableCell>Contact Person</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.map((ngo) => (
                                <TableRow key={ngo._id}>
                                    <TableCell>{ngo.name}</TableCell>
                                    <TableCell>{ngo.registrationNumber}</TableCell>
                                    <TableCell>{ngo.user.name}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={ngo.verificationStatus}
                                            color={ngo.verificationStatus === 'pending' ? 'warning' : 'success'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => {
                                                setSelectedNGO(ngo);
                                                setDialogOpen(true);
                                            }}
                                        >
                                            Review
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Review NGO Verification</DialogTitle>
                <DialogContent>
                    {selectedNGO && (
                        <>
                            <TextField
                                fullWidth
                                label="Remarks"
                                multiline
                                rows={4}
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                margin="normal"
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleVerify('rejected')} color="error">
                        Reject
                    </Button>
                    <Button onClick={() => handleVerify('verified')} color="success">
                        Verify
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

module.exports = VerificationRequests; 