require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { requestLogger, logger } = require('./utils/logger');

const healthRoutes = require('./routes/health');
const artRoutes = require('./routes/art');
// const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'], // Allow multiple frontend URLs
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Use the request logger middleware
app.use(requestLogger);

app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api', artRoutes);
// app.use('/api', homeRoutes);
app.use('/api', authRoutes);
app.use('/api', profileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Only start the server if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        logger.info(`Server listening on http://localhost:${PORT}`);
    });
}

// Export the app for testing
module.exports = app;