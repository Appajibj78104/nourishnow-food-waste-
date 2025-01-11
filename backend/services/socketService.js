const socketService = {
    setupAdminEvents: (io, socket, user) => {
        if (user.role !== 'admin') return;

        // Join admin room
        socket.join('admin-room');

        // Setup real-time metrics emission
        let metricsInterval;
        
        socket.on('startMetricsMonitoring', async () => {
            if (metricsInterval) clearInterval(metricsInterval);
            
            metricsInterval = setInterval(async () => {
                const metrics = await getSystemMetrics();
                socket.emit('systemMetrics', metrics);
            }, 5000);
        });

        socket.on('stopMetricsMonitoring', () => {
            if (metricsInterval) {
                clearInterval(metricsInterval);
            }
        });

        // NGO verification events
        socket.on('ngoVerificationUpdate', async (data) => {
            try {
                const ngo = await NGO.findByIdAndUpdate(
                    data.ngoId,
                    {
                        verificationStatus: data.status,
                        verificationRemarks: data.remarks,
                        verifiedBy: user._id,
                        verifiedAt: new Date()
                    },
                    { new: true }
                );

                io.to(`ngo-${data.ngoId}`).emit('verificationStatusUpdated', {
                    status: ngo.verificationStatus,
                    remarks: ngo.verificationRemarks
                });

                // Log activity
                await ActivityLog.create({
                    user: user._id,
                    action: 'NGO_VERIFICATION_UPDATE',
                    entityType: 'ngo',
                    entityId: ngo._id,
                    details: {
                        status: data.status,
                        remarks: data.remarks
                    }
                });
            } catch (error) {
                socket.emit('error', {
                    message: 'Failed to update NGO verification status',
                    error: error.message
                });
            }
        });

        // System announcements
        socket.on('systemAnnouncement', (data) => {
            io.emit('announcement', {
                message: data.message,
    // Listen for admin broadcast
    socket.on('adminBroadcast', (message) => {
        io.emit('systemAnnouncement', {
            message,
            timestamp: new Date(),
            from: user.name
        });
    });

    // Listen for NGO verification updates
    socket.on('ngoVerificationUpdate', (data) => {
        io.to(`ngo-${data.ngoId}`).emit('verificationStatus', {
            status: data.status,
            message: data.message
        });
    });

    // Listen for system settings updates
    socket.on('settingsUpdate', (settings) => {
        io.emit('systemSettingsChanged', settings);
    });

    // Monitor system metrics
    socket.on('startMetricsMonitoring', () => {
        // Start sending metrics every 30 seconds
        const metricsInterval = setInterval(() => {
            socket.emit('systemMetrics', {
                activeUsers: io.engine.clientsCount,
                timestamp: new Date(),
                // Add other metrics as needed
            });
        }, 30000);

        socket.on('disconnect', () => {
            clearInterval(metricsInterval);
        });
    });
};

module.exports = {
    adminEvents
}; 