const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dose: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
  notes: String,
});

const prescriptionSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: String,
  parsedData: {
    patientName: String,
    date: Date,
    doctorName: String,
    medicines: [medicineSchema],
    rawText: String,
  },
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  validated: {
    type: Boolean,
    default: false,
  },
},
{ timestamps: true }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
