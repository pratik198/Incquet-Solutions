
const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

// GET all scores
router.get('/', async (req, res) => {
    try {
        const scores = await Score.find();
        res.json(scores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new score
router.post('/', async (req, res) => {
    const score = new Score({
        over: req.body.over,
        balls: req.body.balls,
        totalRuns: req.body.totalRuns,
        totalWickets: req.body.totalWickets,
    });

    try {
        const newScore = await score.save();
        res.status(201).json(newScore);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
