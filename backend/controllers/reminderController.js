const Reminder = require('../models/Reminder');

// @desc    Create a new reminder
// @route   POST /api/reminders
// @access  Private (Patient)
exports.createReminder = async (req, res) => {
  try {
    const { medicationId, scheduleCron, timezone } = req.body;
    const userId = req.user.id; // From authenticated user

    if (!medicationId || !scheduleCron || !timezone) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    // Ensure the reminder is for the authenticated user's medication
    // (or a linked patient if role is family, but for now, just patient)
    // This will require fetching the medication and checking its patientId

    const newReminder = new Reminder({
      userId,
      medicationId,
      scheduleCron,
      timezone,
    });

    const reminder = await newReminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
