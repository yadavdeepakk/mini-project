const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadPrescription, getPrescriptionById, createPrescription } = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Routes
router.post('/upload', protect, authorize('patient', 'doctor'), upload.single('image'), uploadPrescription);
router.get('/:id', protect, getPrescriptionById);
router.post('/', protect, authorize('patient', 'doctor'), createPrescription);

module.exports = router;
