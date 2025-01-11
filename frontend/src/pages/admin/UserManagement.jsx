import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    Chip
} from '@mui/material';
import { Edit, Delete, Block } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/admin/users');
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                console.error('Expected an array but got:', response.data);
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await axios.patch(`/api/admin/users/${userId}/status`, {
                status: newStatus
            });
            fetchUsers();
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                User Management
            </Typography>

            <Box mb={3}>
                <TextField
                    label="Search Users"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role}
                                        color={user.role === 'admin' ? 'error' : 'primary'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.status}
                                        color={user.status === 'active' ? 'success' : 'error'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => navigate(`/admin/users/${user._id}`)}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleStatusChange(user._id, 
                                            user.status === 'active' ? 'blocked' : 'active')}
                                    >
                                        <Block />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UserManagement; 