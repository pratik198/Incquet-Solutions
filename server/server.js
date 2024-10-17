// const express = require('express');
// const http = require('http');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const scoreRoutes = require('./routes/scoreRoutes');
// const { updateScoresSocket } = require('./controllers/scoreController');

// dotenv.config();
// connectDB();

// const app = express();
// const server = http.createServer(app);
// const io = require('socket.io')(server);

// app.use(cors());
// app.use(express.json());
// app.use('/api/scores', scoreRoutes);

// io.on('connection', (socket) => {
//     console.log('New client connected');

//     socket.on('updateScores', (data) => {
//         updateScoresSocket(data, io);
//     });

//     socket.on('disconnect', () => {
//         console.log('Client disconnected');
//     });
// });

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const scoreRoutes = require('./routes/scoreRoutes');
const { updateScoresSocket } = require('./controllers/scoreController');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(cors());
app.use(express.json());
app.use('/api/scores', scoreRoutes);

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('updateScores', (data) => {
        updateScoresSocket(data, io);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
