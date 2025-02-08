const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getVolunteers,
    addVolunteer,
    updateVolunteer,
    deleteVolunteer,
    assignVolunteer,
    updateAssignmentStatus,
    addFeedback
} = require('../controllers/volunteerController');

// Protect all routes
router.use(protect);

// Volunteer management routes
router.route('/')
    .get(getVolunteers)
    .post(addVolunteer);

router.route('/:id')
    .put(updateVolunteer)
    .delete(deleteVolunteer);

// Assignment routes
router.post('/:id/assign', assignVolunteer);
router.put('/:id/assignment-status', updateAssignmentStatus);

// Feedback route
router.post('/:id/feedback', addFeedback);

module.exports = router;