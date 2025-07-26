const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration for production
app.use(cors());

app.use(express.json());
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/lostfound', require('./routes/lostFoundRoutes'));
app.use('/api/timetable', require('./routes/timetableRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/techfeed', require('./routes/techPostRoutes'));
app.use('/api/polls', require('./routes/pollRoutes'));

app.use(errorHandler);

// Health check endpoint
app.get('/', (req, res) => {
    res.send('CampusLink API is running!');
});

// Handle 404
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// For Vercel deployment
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

