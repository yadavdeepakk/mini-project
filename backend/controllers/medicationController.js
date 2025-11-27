const Medication = require('../models/Medication');

// @desc    Get all medications for a patient
// @route   GET /api/patients/:id/medications
// @access  Private (Patient/Family with consent)
exports.getPatientMedications = async (req, res) => {
  try {
    const { id } = req.params; // Patient ID

    // Authorization check
    const isAuthorized = 
      req.user.id === id ||
      (req.user.role === 'family' && req.user.linkedPatients.includes(id));

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to view these medications' });
    }

    const medications = await Medication.find({ patientId: id }).populate('prescriptionId');
    res.json(medications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new medication for a patient
// @route   POST /api/medications
// @access  Private (Doctor)
exports.createMedication = async (req, res) => {
  try {
    const { patientId, prescriptionId, name, dose, frequency, schedule } = req.body;

    if (!patientId || !name || !dose || !frequency) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    // Ensure only doctors can create medications
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Not authorized to create medications' });
    }

    const newMedication = new Medication({
      patientId,
      prescriptionId,
      name,
      dose,
      frequency,
      schedule,
    });

    const medication = await newMedication.save();
    res.status(201).json(medication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
