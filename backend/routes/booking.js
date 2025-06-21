const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/bookingController');
const authenticateToken = require('../middleware/auth');

router.get('/', bookingController.getBookings);
router.post('/', bookingController.createBooking);

module.exports = router;