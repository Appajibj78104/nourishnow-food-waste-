import React from 'react';
import {
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
    import adminService from '../../../services/adminService';

const ContentManager = () => {
    const [content, setContent] = React.useState({
        faqs: [],
        announcements: []
    });
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [editItem, setEditItem] = React.useState(null);
    const [formData, setFormData] = React.useState({
        type: 'faq',
        title: '',
        content: ''
    });
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'success'
    });

    React.useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const data = await adminService.getContent();
            setContent(data);
        } catch (error) {
            console.error('Error fetching content:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            if (editItem) {
                await adminService.updateContent(editItem._id, formData);
            } else {
                await adminService.createContent(formData);
            }
            setSnackbar({
                open: true,
                message: `Content ${editItem ? 'updated' : 'created'} successfully`,
                severity: 'success'
            });
            fetchContent();
            handleCloseDialog();
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error saving content',
                severity: 'error'
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            await adminService.deleteContent(id);
            setSnackbar({
                open: true,
                message: 'Content deleted successfully',
                severity: 'success'
            });
            fetchContent();
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error deleting content',
                severity: 'error'
            });
        }
    };

    const handleOpenDialog = (item = null) => {
        if (item) {
            setEditItem(item);
            setFormData({
                type: item.type,
                title: item.title,
                content: item.content
            });
        } else {
            setEditItem(null);
            setFormData({
                type: 'faq',
                title: '',
                content: ''
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditItem(null);
        setFormData({
            type: 'faq',
            title: '',
            content: ''
        });
    };

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">FAQs</Typography>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog()}
                            >
                                Add FAQ
                            </Button>
                        </Box>
                        <List>
                            {content.faqs.map((faq) => (
                                <ListItem key={faq._id}>
                                    <ListItemText
                                        primary={faq.title}
                                        secondary={faq.content}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleOpenDialog(faq)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleDelete(faq._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Announcements</Typography>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog()}
                            >
                                Add Announcement
                            </Button>
                        </Box>
                        <List>
                            {content.announcements.map((announcement) => (
                                <ListItem key={announcement._id}>
                                    <ListItemText
                                        primary={announcement.title}
                                        secondary={announcement.content}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleOpenDialog(announcement)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleDelete(announcement._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editItem ? 'Edit Content' : 'Add New Content'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    title: e.target.value
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Content"
                                multiline
                                rows={4}
                                value={formData.content}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    content: e.target.value
                                })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                    >
                        {editItem ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

module.exports = ContentManager; 