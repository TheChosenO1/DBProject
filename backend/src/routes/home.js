const express = require('express');
const { carousel } = require('../controllers/homeController');

const router = express.Router();

router.get('/home/carousel', carousel);

module.exports = router;

