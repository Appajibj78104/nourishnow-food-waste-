const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createSchedule,
    getSchedules,
    updateScheduleStatus
} = require('../controllers/scheduleController');

router.use(protect);

router.route('/')
    .get(getSchedules)
    .post(createSchedule);

router.route('/:id/status')
    .put(updateScheduleStatus);

module.exports = router; 