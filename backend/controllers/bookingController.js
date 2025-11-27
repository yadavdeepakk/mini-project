const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Patient only)
exports.createBooking = async (req, res) => {
  try {
    const { doctorId, datetime, reason } = req.body;
    const patientId = req.user.id; // From authenticated user

    // Basic validation
    if (!doctorId || !datetime || !reason) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    // Check if doctor exists and has appropriate role
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found or not a doctor' });
    }

    const newBooking = new Booking({
      doctorId,
      patientId,
      datetime,
      reason,
      status: 'pending', // Default status
    });

    const booking = await newBooking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a booking status or add notes
// @route   PATCH /api/bookings/:id
// @access  Private (Doctor or Patient - limited update)
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Allow doctor to update status and notes
    // Allow patient to cancel their own booking (status to 'cancelled')
    if (req.user.role === 'doctor' && booking.doctorId.toString() === req.user.id) {
      if (status) booking.status = status;
      if (notes) booking.notes = notes;
    } else if (req.user.role === 'patient' && booking.patientId.toString() === req.user.id && status === 'cancelled') {
      booking.status = status;
    } else {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
