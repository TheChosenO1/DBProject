const { getUserById, getReviews, getNotes, getArtSeen, getFavs } = require('../services/getInfoService');
const {logger} = require("../utils/logger");

async function getProfile(req, res) {
    const userId = parseInt(req.params.userId, 10);
    const tokenUserId = parseInt(req.user.id,      10);; 
    if (userId !== tokenUserId) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try{
        const [user, revies, notes, artSeen, favs] = await Promise.all([
            getUserById(userId),
            getReviews(userId),
            getNotes(userId),
            getArtSeen(userId),
            getFavs(userId)
        ]);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                id: user.userid,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
            },
            reviews: revies,
            notes: notes,
            artSeen: artSeen,
            favs: favs
        });
    } catch (err) {
        logger.error(`Get Profile Error: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getProfile,
};







