const express = require('express');
const router = express.Router();

const {getFullArtwork} = require('../controllers/detailsController.js');
const { authenticateToken } = require('../middleware/auth');

router.post('/details', authenticateToken, getFullArtwork);

module.exports = router;