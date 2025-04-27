const express = require('express');

const {uploadArtSeen, uploadReview, uploadNote, uploadFav, editNote,
    removeArtSeen, removeNote, removeFav, removeReview} = require('../controllers/uploadController');

const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/upload/artseen', authenticateToken, uploadArtSeen);
router.post('/upload/review', authenticateToken, uploadReview);
router.post('/upload/note', authenticateToken, uploadNote);
router.post('/upload/fav', authenticateToken, uploadFav);
router.put('/upload/note/edit', authenticateToken, editNote);
router.delete('/upload/artseen/delete', authenticateToken, removeArtSeen);
router.delete('/upload/review/delete', authenticateToken, removeReview);
router.delete('/upload/note/delete', authenticateToken, removeNote);
router.delete('/upload/fav/delete', authenticateToken, removeFav);

module.exports = router;