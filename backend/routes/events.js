const express = require('express');
const router = express.Router();
const eventController = require('../Controllers/eventController');
const authenticateToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get('/', eventController.getEvents);
router.post('/', authenticateToken, upload.single('image'), eventController.createEvent);
router.delete('/:id', authenticateToken, eventController.deleteEvent);
router.put('/:id', authenticateToken, upload.single('image'), eventController.updateEvent);

module.exports = router;