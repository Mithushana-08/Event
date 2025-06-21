const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');

router.post('/login', adminController.login);

module.exports = router;