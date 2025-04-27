const express = require('express');
const {authenticateToken} = require('../middleware/auth');
const { getProfile }        = require('../controllers/profileController');


const router = express.Router();


router.get(
  '/users/:userId/profile',
  authenticateToken,
  getProfile
);

module.exports = router;
