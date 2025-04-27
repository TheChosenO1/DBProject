
const {addArtSeen, addReview, addNote, addFav, updateNoteText, deleteNote, deleteArtSeen, deleteFav, deleteReview } = require('../services/uploadService');
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

async function removeArtSeen(req, res) {
    const artworkID = parseInt(req.body.artworkId, 10);
    const userID  = parseInt(req.user.id, 10);
    console.log('removeArtSeen → user:', req.user.id, ' artwork:', req.body.artworkId);
    if( !userID || !artworkID) {
        return res.status(400).json({ error: 'User ID and Artwork ID are required' });
    }
    try{
        
        const removedArtSeen = await deleteArtSeen(userID, artworkID);
        if (removedArtSeen){
            res.sendStatus(204) //Deleted Successfully (i hope this is the right status code);
        }
        else {
            res.status(404).json({ error: 'Artwork seen status not found' }); //Not Found
        }
    } catch (err) {
        logger.error(`Remove Art Seen Error: ${err.message}`);
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

async function removeReview(req, res) {
    const reviewID = parseInt(req.body.reviewId, 10);
    const userID  = parseInt(req.user.id, 10);
    if (!userID || !reviewID) {
        return res.status(400).json({ error: 'User ID and Review ID are required' });
    }
    try{
        const removedReview = await deleteReview(reviewID, userID);
        if (removedReview){
            res.sendStatus(204) //Deleted Successfully (i hope this is the right status code);
        }
        else {
            res.status(404).json({ error: 'Review not found' }); //Not Found
        }
    } catch (err) {
        logger.error(`Remove Review Error: ${err.message}`);
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

async function editNote(req, res) {
    const userID  = parseInt(req.user.id, 10);
    const noteID = parseInt(req.body.noteId, 10);
    const { noteText } = req.body;
    
    if (!userID || !noteID || !noteText) {
        return res.status(400).json({ error: 'User ID, Note ID and Note text are required' });
    }
    try {
        const updatedNote = await updateNoteText(noteID, userID, noteText);
        if (updatedNote) {
            res.status(200).json({ updatedNote });
        }
        else {
            res.status(404).json({ error: 'Note not found' });
        }
    } catch (err) {
        logger.error(`Edit Note Error: ${err.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function removeNote(req, res) {
    const noteID = parseInt(req.body.noteId, 10);
    const userID  = parseInt(req.user.id, 10);
    if (!userID || !noteID) {
        return res.status(400).json({ error: 'User ID and Note ID are required' });
    }
    try{
        const removedNote = await deleteNote(noteID, userID);
        if (removedNote){
            res.sendStatus(204) //Deleted Successfully (i hope this is the right status code);
        }
        else {
            res.status(404).json({ error: 'Note not found' }); //Not Found
        }
    } catch (err) {
        logger.error(`Remove Note Error: ${err.message}`);
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

async function removeFav(req, res) {
    const artworkID = parseInt(req.body.artworkId, 10);
    const userID  = parseInt(req.user.id, 10);

    if( !userID || !artworkID) {
        return res.status(400).json({ error: 'User ID and Artwork ID are required' });
    }
    try{
        const removedFav = await deleteFav( artworkID, userID);
        if (removedFav){
            res.sendStatus(204) //Deleted Successfully (i hope this is the right status code);
        }
        else {
            res.status(404).json({ error: 'Artwork favorite not found' }); //Not Found
        }
    } catch (err) {
        logger.error(`Remove Favorite Error: ${err.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    uploadArtSeen,
    uploadReview,
    uploadNote,
    uploadFav,
    removeArtSeen,
    removeReview,
    removeNote,
    removeFav,
    editNote
};

