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
    TextField,
    Box,
    IconButton,
    Chip,
    MenuItem
} = require('@mui/material');
const {
    Edit: EditIcon,
    Block: BlockIcon,
    CheckCircle: ActiveIcon
} = require('@mui/icons-material');
const adminService = require('../../../services/adminService');

const UserList = () => {
    const [users, setUsers] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [search, setSearch] = React.useState('');
    const [role, setRole] = React.useState('');
    const [total, setTotal] = React.useState(0);

    React.useEffect(() => {
        fetchUsers();
    }, [page, rowsPerPage, search, role]);

    const fetchUsers = async () => {
        try {
            const data = await adminService.getUsers({
                page: page + 1,
                limit: rowsPerPage,
                search,
                role
            });
            setUsers(data.users);
            setTotal(data.total);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await adminService.updateUserStatus(userId, newStatus);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    return (
        <Paper elevation={2} sx={{ p: 2 }}>
            {/* Rest of the component JSX remains the same */}
        </Paper>
    );
};

module.exports = UserList; 