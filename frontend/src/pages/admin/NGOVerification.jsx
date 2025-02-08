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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    Grid
} from '@mui/material';
import { CheckCircle, Cancel, RemoveRedEye } from '@mui/icons-material';
import axios from 'axios';

const NGOVerification = () => {
    const [ngos, setNgos] = useState([]);
    const [selectedNGO, setSelectedNGO] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNGOs();
    }, []);

    const fetchNGOs = async () => {
        try {
            const response = await axios.get('/api/admin/ngo/verification-requests');
            if (Array.isArray(response.data)) {
                setNgos(response.data);
            } else {
                console.error('Expected an array but got:', response.data);
                setNgos([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching NGOs:', error);
            setLoading(false);
        }
    };

    const handleVerify = async (ngoId, status) => {
        try {
            await axios.patch(`/api/admin/ngo/${ngoId}/verify`, {
                status,
                remarks
            });
            setOpenDialog(false);
            setRemarks('');
            fetchNGOs();
        } catch (error) {
            console.error('Error updating NGO status:', error);
        }
    };

    const viewDocuments = (ngo) => {
        setSelectedNGO(ngo);
        setOpenDialog(true);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                NGO Verification
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Registration Number</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Documents</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ngos.map((ngo) => (
                            <TableRow key={ngo._id}>
                                <TableCell>{ngo.name}</TableCell>
                                <TableCell>{ngo.registrationNumber}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={ngo.verificationStatus}
                                        color={
                                            ngo.verificationStatus === 'verified' 
                                                ? 'success' 
                                                : ngo.verificationStatus === 'rejected' 
                                                    ? 'error' 
                                                    : 'warning'
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        startIcon={<RemoveRedEye />}
                                        onClick={() => viewDocuments(ngo)}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        startIcon={<CheckCircle />}
                                        color="success"
                                        onClick={() => handleVerify(ngo._id, 'verified')}
                                    >
                                        Verify
                                    </Button>
                                    <Button
                                        startIcon={<Cancel />}
                                        color="error"
                                        onClick={() => handleVerify(ngo._id, 'rejected')}
                                    >
                                        Reject
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md">
                <DialogTitle>NGO Documents</DialogTitle>
                <DialogContent>
                    {selectedNGO && (
                        <Grid2 container spacing={2}>
                            <Grid2 item xs={12}>
                                <Typography variant="h6">Registration Certificate</Typography>
                                <img 
                                    src={selectedNGO.documents.registrationCertificate} 
                                    alt="Registration Certificate"
                                    style={{ maxWidth: '100%' }}
                                />
                            </Grid2>
                            <Grid2 item xs={12}>
                                <Typography variant="h6">PAN Card</Typography>
                                <img 
                                    src={selectedNGO.documents.panCard} 
                                    alt="PAN Card"
                                    style={{ maxWidth: '100%' }}
                                />
                            </Grid2>
                            <Grid2 item xs={12}>
                                <TextField
                                    label="Verification Remarks"
                                    multiline
                                    rows={4}
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    fullWidth
                                />
                            </Grid2>
                        </Grid2>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default NGOVerification; 