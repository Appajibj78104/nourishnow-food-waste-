const NGO = require('../models/NGO');
const Donation = require('../models/Donation');
const Inventory = require('../models/Inventory');
const moment = require('moment');

const getAnalytics = async (req, res) => {
    // Keep only admin analytics code here
    // ... existing admin analytics code ...
};

module.exports = {
    getAnalytics  // Only export admin analytics
};