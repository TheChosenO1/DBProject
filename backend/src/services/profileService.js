const pool = require('../db/pool');
const { logger } = require('../utils/logger');

async function getUserById(userId) {
    try {
        const { rows } = await pool.query(
            'SELECT id as userid, username, email, first_name, last_name, created_at FROM users WHERE id = $1',
            [userId]
        );
        return rows[0];
    } catch (err) {
        logger.error(`Error in getUserById: ${err.message}`);
        throw err;
    }
}

async function getReviews(userId) {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM reviews WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    } catch (err) {
        logger.error(`Error in getReviews: ${err.message}`);
        throw err;
    }
}

async function getNotes(userId) {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    } catch (err) {
        logger.error(`Error in getNotes: ${err.message}`);
        throw err;
    }
}

async function getArtSeen(userId) {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM art_seen WHERE user_id = $1 ORDER BY seen_date DESC',
            [userId]
        );
        return rows;
    } catch (err) {
        logger.error(`Error in getArtSeen: ${err.message}`);
        throw err;
    }
}

async function getFavs(userId) {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    } catch (err) {
        logger.error(`Error in getFavs: ${err.message}`);
        throw err;
    }
}

module.exports = {
    getUserById,
    getReviews,
    getNotes,
    getArtSeen,
    getFavs
}; 