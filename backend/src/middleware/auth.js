// middleware/auth.js
const { verify } = require('../utils/jwt');
const { logger } = require('../utils/logger');

/**
 * Express middleware to authenticate JWT bearer tokens.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Use our shared verify function from utils/jwt
    const user = verify(token);
    req.user = user;
    next();
  } catch (error) {
    logger.error(`Auth Error: ${error.message}`);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { authenticateToken };