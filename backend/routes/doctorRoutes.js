const express = require('express');
const { getDoctorBookings } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:id/bookings', protect, authorize('doctor', 'admin'), getDoctorBookings);

module.exports = router;
