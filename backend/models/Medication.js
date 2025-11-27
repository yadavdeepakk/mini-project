const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',
  },
  name: { type: String, required: true },
  dose: { type: String, required: true },
  frequency: { type: String, required: true },
  schedule: [
    {
      type: Date,
    },
  ], // Array of timestamps for scheduled intake
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active',
  },
},
{ timestamps: true }
);

module.exports = mongoose.model('Medication', medicationSchema);
