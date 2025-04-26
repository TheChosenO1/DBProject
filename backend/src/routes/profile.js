const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;
