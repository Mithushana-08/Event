const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/bookingController');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, bookingController.getBookings);

module.exports = router;