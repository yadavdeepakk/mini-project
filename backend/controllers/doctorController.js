const DoctorProfile = require('../models/DoctorProfile');
const Booking = require('../models/Booking');

// @desc    Get doctor's bookings
// @route   GET /api/doctors/:id/bookings
// @access  Private (Doctor only)
exports.getDoctorBookings = async (req, res) => {
  try {
    const { id } = req.params; // Doctor ID
    const { from, to } = req.query;

    // Ensure the authenticated user is the doctor or an admin
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these bookings' });
    }

    const query = { doctorId: id };
    if (from && to) {
      query.datetime = { $gte: new Date(from), $lte: new Date(to) };
    }

    const bookings = await Booking.find(query).populate('patientId', 'name email');
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
