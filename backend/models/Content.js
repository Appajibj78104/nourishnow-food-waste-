const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content; 