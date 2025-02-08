const Donation = require('../models/Donation');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getDashboardStats = catchAsync(async (req, res) => {
    const ngoId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all relevant stats in parallel
    const [
        totalDonations,
        activePickups,
        pendingPickups,
        activeDeliveries,
        completedToday,
        successRate,
        peopleServed
    ] = await Promise.all([
        // Total donations
        Donation.countDocuments({ assignedNGO: ngoId }),

        // Active pickups
        Donation.countDocuments({
            assignedNGO: ngoId,
            status: 'pickup_in_progress'
        }),

        // Pending pickups
        Donation.countDocuments({
            assignedNGO: ngoId,
            status: 'accepted'
        }),

        // Active deliveries
        Donation.countDocuments({
            assignedNGO: ngoId,
            status: 'in_transit'
        }),

        // Completed today
        Donation.countDocuments({
            assignedNGO: ngoId,
            status: 'completed',
            'deliveryDetails.completionTime': { $gte: today }
        }),

        // Success rate calculation
        Donation.aggregate([
            {
                $match: {
                    assignedNGO: ngoId,
                    status: { $in: ['completed', 'cancelled'] }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    completed: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
                        }
                    }
                }
            }
        ]),

        // People served
        Donation.aggregate([
            {
                $match: {
                    assignedNGO: ngoId,
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$deliveryDetails.beneficiariesServed' }
                }
            }
        ])
    ]);

    // Calculate success rate
    const successRateValue = successRate.length > 0
        ? Math.round((successRate[0].completed / successRate[0].total) * 100)
        : 0;

    // Calculate total people served
    const totalPeopleServed = peopleServed.length > 0 ? peopleServed[0].total : 0;

    res.json({
        totalDonations,
        peopleServed: totalPeopleServed,
        activePickups,
        successRate: successRateValue,
        pendingPickups,
        activeDeliveries,
        completedToday
    });
}); 