const express = require('express');
const { carousel } = require('../controllers/artController');

const router = express.Router();

router.get('/art/carousel', carousel);

module.exports = router;

