const express = require('express');
const authRoutes = require('./authRoutes.js');  
const ngoRoutes = require('./ngoRoutes.js');
const donationRoutes = require('./donationRoutes.js');
const chatRoutes = require('./chatRoutes.js');
const volunteerRoutes = require('./volunteerRoutes.js');

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/ngo', ngoRoutes);
router.use('/donations', donationRoutes);
router.use('/chat', chatRoutes);
router.use('/api/ngo/dashboard', ngoRoutes);
router.use('/api/ngo/donations', donationRoutes);
router.use('/api/ngo/volunteers', volunteerRoutes);

module.exports = router;