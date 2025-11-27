const express = require('express');
const { getPatientMedications, createMedication } = require('../controllers/medicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get all medications for a specific patient
router.get('/patients/:id/medications', protect, authorize('patient', 'doctor', 'family'), getPatientMedications);

// Route to create a new medication (typically by a doctor)
router.post('/medications', protect, authorize('doctor'), createMedication);

module.exports = router;
