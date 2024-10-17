require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => console.error('MongoDB connection error:', err));

// Score model
const ScoreSchema = new mongoose.Schema({
    runs: Number,
    wickets: Number,
    currentOver: Number,
    currentBall: Number,
    overs: Array,
});
const Score = mongoose.model('Score', ScoreSchema);

// REST API Routes
app.get('/api/score', async (req, res) => {
    const score = await Score.findOne();
    res.json(score);
});

app.post('/api/score', async (req, res) => {
    const { runs, wickets, currentOver, currentBall, overs } = req.body;
    let score = await Score.findOne();
    if (score) {
        score.runs = runs;
        score.wickets = wickets;
        score.currentOver = currentOver;
        score.currentBall = currentBall;
        score.overs = overs;
    } else {
        score = new Score(req.body);
    }
    await score.save();
    io.emit('scoreUpdated', score);  // Emit real-time update
    res.json(score);
});

// WebSocket connection
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
