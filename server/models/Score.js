const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    over: { type: Number, required: true },
    balls: [{ type: String }],
    totalRuns: { type: Number, default: 0 },
    totalWickets: { type: Number, default: 0 }
});

module.exports = mongoose.model('Score', scoreSchema);
