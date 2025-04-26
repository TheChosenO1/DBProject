const { getUserById, getReviews, getNotes, getArtSeen, getFavs } = require('../services/profileService');
const {logger} = require("../utils/logger");
const pool = require('../db/pool');

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await getUserById(userId);
        const reviews = await getReviews(userId);
        const notes = await getNotes(userId);
        const artSeen = await getArtSeen(userId);
        const favs = await getFavs(userId);

        res.json({
            status: 'success',
            profile: {
                user,
                reviews,
                notes,
                artSeen,
                favs
            }
        });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email } = req.body;

        const { rows } = await pool.query(
            'UPDATE users SET username = $1, email = $2, updated_at = NOW() WHERE id = $3 RETURNING id, username, email, updated_at',
            [username, email, userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Profile not found' });
        }

        res.json({ status: 'success', profile: rows[0] });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};








