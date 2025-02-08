const Schedule = require('../models/Schedule');
const Donation = require('../models/Donation');
const NGO = require('../models/NGO');
const Volunteer = require('../models/Volunteer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createSchedule = catchAsync(async (req, res) => {
    const { donationId, volunteers, pickupTime } = req.body;

    // Verify NGO
    const ngo = await NGO.findOne({ user: req.user._id });
    if (!ngo) {
        throw new AppError('NGO not found', 404);
    }

    // Verify donation exists and is available
    const donation = await Donation.findById(donationId);
    if (!donation || donation.status !== 'pending') {
        throw new AppError('Donation not available', 400);
    }

    // Create schedule
    const schedule = await Schedule.create({
        ngo: ngo._id,
        donation: donationId,
        volunteers,
        pickupTime
    });

    // Update donation status
    donation.status = 'scheduled';
    donation.assignedNGO = ngo._id;
    await donation.save();

    // Notify volunteers
    const io = req.app.get('io');
    volunteers.forEach(volunteerId => {
        io.to(`volunteer:${volunteerId}`).emit('assignedPickup', {
            scheduleId: schedule._id,
            pickupTime
        });
    });

    res.status(201).json(schedule);
});

exports.getSchedules = catchAsync(async (req, res) => {
    const ngo = await NGO.findOne({ user: req.user._id });
    if (!ngo) {
        throw new AppError('NGO not found', 404);
    }

    const schedules = await Schedule.find({ ngo: ngo._id })
        .populate('donation')
        .populate('volunteers')
        .sort('-pickupTime');

    res.json(schedules);
});

exports.updateScheduleStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const schedule = await Schedule.findById(id);
    if (!schedule) {
        throw new AppError('Schedule not found', 404);
    }

    schedule.status = status;
    if (status === 'completed') {
        schedule.completionDetails = {
            completedAt: new Date(),
            ...req.body.completionDetails
        };

        // Update donation status
        await Donation.findByIdAndUpdate(schedule.donation, {
            status: 'completed'
        });
    }

    await schedule.save();

    // Notify volunteers
    const io = req.app.get('io');
    schedule.volunteers.forEach(volunteerId => {
        io.to(`volunteer:${volunteerId}`).emit('scheduleUpdate', {
            scheduleId: schedule._id,
            status
        });
    });

    res.json(schedule);
});

exports.deleteSchedule = catchAsync(async (req, res) => {
    const { id } = req.params;
    
    const schedule = await Schedule.findByIdAndDelete(id);
    if (!schedule) {
        throw new AppError('Schedule not found', 404);
    }

    // Reset donation status
    await Donation.findByIdAndUpdate(schedule.donation, {
        status: 'pending'
    });

    res.json({ message: 'Schedule deleted successfully' });
});