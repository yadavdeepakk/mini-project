const express = require('express');
const { createReminder } = require('../controllers/reminderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('patient'), createReminder);

module.exports = router;
