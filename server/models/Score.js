
const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    over: { type: Number, required: true },
    balls: { type: [Number], default: [] },
    totalRuns: { type: Number, default: 0 },
    totalWickets: { type: Number, default: 0 },
}, {
    timestamps: true
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
