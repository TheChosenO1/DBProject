require('dotenv').config();
const express = require('express');
const { requestLogger, logger } = require('./utils/logger');

const healthRoutes = require('./routes/health');
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');

const app = express();

// Use the request logger middleware
app.use(requestLogger);

app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api', homeRoutes);
app.use('/api', authRoutes);

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