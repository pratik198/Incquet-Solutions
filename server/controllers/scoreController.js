const Score = require('../models/Score');

const updateScoresSocket = async (data, io) => {
    const { over, ball, run, wicket } = data;
    try {
        const score = await Score.findOne({ over });
        if (score) {
            score.balls[ball - 1] = run;
            score.totalRuns += run === 'Out' ? 0 : parseInt(run, 10);
            score.totalWickets += run === 'Out' ? 1 : 0;
            await score.save();
            io.emit('scoreUpdated', score);
        }
    } catch (error) {
        console.error('Error updating scores:', error);
    }
};

module.exports = { updateScoresSocket };
