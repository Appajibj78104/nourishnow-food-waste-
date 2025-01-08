const express = require('express');
const authRoutes = require('./authRoutes.js');  
const ngoRoutes = require('./ngoRoutes.js');
const donationRoutes = require('./donationRoutes.js');
const chatRoutes = require('./chatRoutes.js');

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/ngo', ngoRoutes);
router.use('/donations', donationRoutes);
router.use('/chat', chatRoutes);

module.exports = router;