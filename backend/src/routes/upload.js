const express = require('express');

const {uploadArtSeen, uploadReview, uploadNote, uploadFav} = require('../controllers/uploadController');

const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/upload/artseen', authenticateToken, uploadArtSeen);
router.post('/upload/review', authenticateToken, uploadReview);
router.post('/upload/note', authenticateToken, uploadNote);
router.post('/upload/fav', authenticateToken, uploadFav);

module.exports = router;