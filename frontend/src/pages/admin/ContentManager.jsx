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
    Alert
} from '@mui/material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ContentManager = () => {
    const [content, setContent] = useState([]);
    const [newContent, setNewContent] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/content`);
            if (Array.isArray(response.data)) {
                setContent(response.data);
            } else {
                console.error('Expected an array but got:', response.data);
                setContent([]);
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        }
    };

    const handleAddContent = async () => {
        try {
            const response = await axios.post(`${API_URL}/admin/content`, { content: newContent });
            setContent([...content, response.data]);
            setNewContent('');
            setSnackbar({ open: true, message: 'Content added successfully!', severity: 'success' });
        } catch (error) {
            console.error('Error adding content:', error);
            setSnackbar({ open: true, message: 'Error adding content', severity: 'error' });
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Content Management
            </Typography>

            <TextField
                label="New Content"
                variant="outlined"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleAddContent}>
                Add Content
            </Button>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Content</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {content.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item.content}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="error" onClick={() => handleDeleteContent(item._id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

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

export default ContentManager; 