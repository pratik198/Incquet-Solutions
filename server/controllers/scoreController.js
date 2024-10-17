
const Score = require('../models/Score');

async function updateScoresSocket(data, io) {
    try {
        const updatedScore = await Score.findByIdAndUpdate(data.id, data, { new: true });
        io.emit('scoresUpdated', updatedScore);
    } catch (error) {
        console.error('Error updating score:', error);
    }
}

module.exports = { updateScoresSocket };
