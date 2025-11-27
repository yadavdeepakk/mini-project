const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['doctor', 'patient', 'family'],
    required: true,
  },
  profile: mongoose.Schema.Types.ObjectId, // Will reference DoctorProfile or PatientProfile (if we create one)
  linkedPatients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
},
{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
