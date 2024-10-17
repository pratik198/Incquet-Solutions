const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const scoreRoutes = require('./routes/scoreRoutes');
const { updateScoresSocket } = require('./controllers/scoreController');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// REST API routes
app.use('/api/scores', scoreRoutes);

// WebSocket connection
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    // Custom event to update scores
    socket.on('updateScores', (data) => {
        updateScoresSocket(data, io);
    });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
