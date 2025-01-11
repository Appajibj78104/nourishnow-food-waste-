const setupAdminSocketEvents = (socket) => {
    // NGO verification events
    socket.on('ngoVerificationRequest', (data) => {
        // Handle new NGO verification request
    });

    // Real-time metrics events
    socket.on('systemMetrics', (data) => {
        // Handle system metrics update
    });

    // User activity events
    socket.on('userActivity', (data) => {
        // Handle user activity updates
    });

    // Donation events
    socket.on('donationAlert', (data) => {
        // Handle donation alerts
    });

    return () => {
        socket.off('ngoVerificationRequest');
        socket.off('systemMetrics');
        socket.off('userActivity');
        socket.off('donationAlert');
    };
};

module.exports = setupAdminSocketEvents; 