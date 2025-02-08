const Volunteer = require('../models/Volunteer');
const NGO = require('../models/NGO');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all volunteers for an NGO
exports.getVolunteers = catchAsync(async (req, res) => {
    const ngo = await NGO.findOne({ user: req.user._id });
    if (!ngo) {
        throw new AppError('NGO not found', 404);
    }

    const volunteers = await Volunteer.find({ ngo: ngo._id })
        .select('-documents')
        .sort('-createdAt');

    res.json(volunteers);
});

// Add new volunteer
exports.addVolunteer = catchAsync(async (req, res) => {
    const ngo = await NGO.findOne({ user: req.user._id });
    if (!ngo) {
        throw new AppError('NGO not found', 404);
    }

    const volunteer = await Volunteer.create({
        ...req.body,
        ngo: ngo._id
    });

    res.status(201).json(volunteer);
});

// Update volunteer
exports.updateVolunteer = catchAsync(async (req, res) => {
    const ngo = await NGO.findOne({ user: req.user._id });
    if (!ngo) {
        throw new AppError('NGO not found', 404);
    }

    const volunteer = await Volunteer.findOneAndUpdate(
        { _id: req.params.id, ngo: ngo._id },
        req.body,
        { new: true, runValidators: true }
    );

    if (!volunteer) {
        throw new AppError('Volunteer not found', 404);
    }

    res.json(volunteer);
});

// Delete volunteer
exports.deleteVolunteer = catchAsync(async (req, res) => {
    const ngo = await NGO.findOne({ user: req.user._id });
    if (!ngo) {
        throw new AppError('NGO not found', 404);
    }

    const volunteer = await Volunteer.findOneAndDelete({
        _id: req.params.id,
        ngo: ngo._id
    });

    if (!volunteer) {
        throw new AppError('Volunteer not found', 404);
    }

    res.json({ message: 'Volunteer deleted successfully' });
});

// Assign volunteer to donation
exports.assignVolunteer = catchAsync(async (req, res) => {
    const { volunteerId, donationId, role } = req.body;

    const volunteer = await Volunteer.findOneAndUpdate(
        { _id: volunteerId, ngo: req.ngo._id },
        {
            $push: {
                assignments: {
                    donation: donationId,
                    role,
                    date: new Date()
                }
            }
        },
        { new: true }
    );

    if (!volunteer) {
        throw new AppError('Volunteer not found', 404);
    }

    res.json(volunteer);
});

// Update volunteer assignment status
exports.updateAssignmentStatus = catchAsync(async (req, res) => {
    const { volunteerId, assignmentId, status } = req.body;

    const volunteer = await Volunteer.findOneAndUpdate(
        { 
            _id: volunteerId,
            ngo: req.ngo._id,
            'assignments._id': assignmentId
        },
        {
            $set: {
                'assignments.$.status': status
            }
        },
        { new: true }
    );

    if (!volunteer) {
        throw new AppError('Volunteer or assignment not found', 404);
    }

    res.json(volunteer);
});

// Add volunteer feedback
exports.addFeedback = catchAsync(async (req, res) => {
    const { volunteerId, comment, rating } = req.body;

    const volunteer = await Volunteer.findOneAndUpdate(
        { _id: volunteerId, ngo: req.ngo._id },
        {
            $push: {
                feedback: {
                    comment,
                    rating,
                    date: new Date()
                }
            }
        },
        { new: true }
    );

    if (!volunteer) {
        throw new AppError('Volunteer not found', 404);
    }

    // Update overall rating
    const avgRating = volunteer.feedback.reduce((acc, curr) => acc + curr.rating, 0) / volunteer.feedback.length;
    volunteer.rating = Math.round(avgRating * 10) / 10;
    await volunteer.save();

    res.json(volunteer);
});