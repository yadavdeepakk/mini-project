const express = require('express');
const { createBooking, updateBooking } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('patient'), createBooking);
router.patch('/:id', protect, authorize('doctor', 'patient'), updateBooking);

module.exports = router;
