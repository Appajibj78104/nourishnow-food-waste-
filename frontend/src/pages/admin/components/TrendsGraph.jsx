const React = require('react');
const {
    Paper,
    Box,
    Typography,
    FormControl,
    Select,
    MenuItem,
    CircularProgress
} = require('@mui/material');
const {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} = require('recharts');
const adminService = require('../../../services/adminService');

const TrendsGraph = () => {
    const [trendsData, setTrendsData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [timeRange, setTimeRange] = React.useState('month');

    React.useEffect(() => {
        fetchTrendsData();
    }, [timeRange]);

    const fetchTrendsData = async () => {
        try {
            const data = await adminService.getAnalytics({
                type: 'trends',
                timeRange
            });
            setTrendsData(data);
        } catch (error) {
            console.error('Error fetching trends data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper elevation={2} sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Donation Trends</Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <MenuItem value="week">Last Week</MenuItem>
                        <MenuItem value="month">Last Month</MenuItem>
                        <MenuItem value="year">Last Year</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            
            <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="donations"
                            stroke="#2196f3"
                            name="Donations"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="meals"
                            stroke="#4caf50"
                            name="Meals Served"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

module.exports = TrendsGraph; 