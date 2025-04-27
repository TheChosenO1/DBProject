
const {addArtSeen, addReview, addNote, addFav} = require('../services/uploadService');
const { logger } = require('../utils/logger');

async function uploadArtSeen(req, res) {
    const userID  = parseInt(req.user.id, 10);
    const artworkID = parseInt(req.body.artworkId, 10);
    
    if (!userID || !artworkID) {
        return res.status(400).json({ error: 'User ID and Artwork ID are required' });
    }

    try {
        await addArtSeen(userID, artworkID);
        res.status(201).json({ message: 'Artwork seen status added successfully' });
    } catch (err) {
        logger.error(`Upload Art Seen Error: ${err.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function uploadReview(req, res) {
    const userID  = parseInt(req.user.id, 10);
    const artworkID = parseInt(req.body.artworkId, 10);
    const rating = req.body.rating;
    const { reviewText } = req.body;
    
    if (!userID || !artworkID || !reviewText || !rating) {
        return res.status(400).json({ error: 'User ID, Artwork ID and Review are required' });
    }

    try {
        const newReview = await addReview(userID, artworkID, rating, reviewText);
        res.status(201).json({newReview});
    } catch (err) {
        logger.error(`Upload Review Error: ${err.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function uploadNote(req, res) {
    const userID  = parseInt(req.user.id, 10);
    const artworkID = parseInt(req.body.artworkId, 10);
    const { noteText } = req.body;
    
    if (!userID || !artworkID || !noteText) {
        return res.status(400).json({ error: 'User ID, Artwork ID and Note are required' });
    }

    try {
        const newNote = await addNote(userID, artworkID, noteText);
        res.status(201).json({ newNote });
    } catch (err) {
        logger.error(`Upload Note Error: ${err.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function uploadFav(req, res) {
    const userID  = parseInt(req.user.id, 10);
    const artworkID = parseInt(req.body.artworkId, 10);
    
    if (!userID || !artworkID) {
        return res.status(400).json({ error: 'User ID and Artwork ID are required' });
    }

    try {
        await addFav(userID, artworkID);
        res.status(201).json({ message: 'Artwork favorited successfully' });
    } catch (err) {
        logger.error(`Upload Favorite Error: ${err.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    uploadArtSeen,
    uploadReview,
    uploadNote,
    uploadFav,
};

