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
    Chip,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DonationManagement = () => {
    const [donations, setDonations] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDonations();
    }, [filter]);

    const fetchDonations = async () => {
        try {
            const response = await axios.get(`/api/admin/donations/${filter}`);
            if (Array.isArray(response.data)) {
                setDonations(response.data);
            setLoading(false);
            } else {
                console.error('Expected an array but got:', response.data);
                setDonations([]);
            }
            
        } catch (error) {
            console.error('Error fetching donations:', error);
            setLoading(false);
        }
    };

    const filteredDonations = donations.filter(donation =>
        donation.title.toLowerCase().includes(search.toLowerCase()) ||
        donation.donor.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Donation Management
            </Typography>

            <Box mb={3} display="flex" gap={2}>
                <TextField
                    label="Search Donations"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ flexGrow: 1 }}
                />
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Filter Status</InputLabel>
                    <Select
                        value={filter}
                        label="Filter Status"
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <MenuItem value="all">All Donations</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="expired">Expired</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Donor</TableCell>
                            <TableCell>NGO</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDonations.map((donation) => (
                            <TableRow key={donation._id}>
                                <TableCell>{donation.title}</TableCell>
                                <TableCell>{donation.donor.name}</TableCell>
                                <TableCell>
                                    {donation.assignedNGO ? donation.assignedNGO.name : 'Unassigned'}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={donation.status}
                                        color={
                                            donation.status === 'active' 
                                                ? 'success' 
                                                : donation.status === 'completed'
                                                    ? 'primary'
                                                    : 'error'
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    {new Date(donation.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate(`/admin/donations/${donation._id}`)}
                                    >
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default DonationManagement; 