const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  medicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: true,
  },
  scheduleCron: {
    type: String,
    required: true,
  }, // Cron string for scheduling
  timezone: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
},
{ timestamps: true }
);

module.exports = mongoose.model('Reminder', reminderSchema);
