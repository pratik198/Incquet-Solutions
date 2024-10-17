const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

// Route to get the latest scores
router.get('/', async (req, res) => {
    try {
        const scores = await Score.find();
        res.json(scores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
