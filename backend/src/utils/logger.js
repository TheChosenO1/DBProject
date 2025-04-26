const winston = require('winston');

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
);

// Create logger instance
const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        // Write all logs to console
        new winston.transports.Console(),
        // Write all logs to file
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// Create a middleware for logging HTTP requests
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Log the incoming request
    logger.info(`Incoming ${req.method} request to ${req.url}`);
    
    // Capture response data
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`Response: ${res.statusCode} - ${req.method} ${req.url} - ${duration}ms`);
    });
    
    next();
};

module.exports = {
    logger,
    requestLogger
}; 