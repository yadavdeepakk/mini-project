const Prescription = require('../models/Prescription');
// Multer will be configured directly in the route for now.

// Placeholder for OCR processing. This will be expanded later.
const processImageWithOCR = async (imagePath, ocrOption = 'cloud') => {
  console.log(`Processing image ${imagePath} with ${ocrOption} OCR`);
  // In a real implementation, this would call Google Cloud Vision, AWS Textract, or Tesseract.js
  // For now, return dummy data
  return {
    patientName: "John Doe",
    date: new Date(),
    doctorName: "Dr. Smith",
    medicines: [
      { name: "Amoxicillin", dose: "250mg", frequency: "TID", duration: "7 days", notes: "Take with food" },
      { name: "Ibuprofen", dose: "200mg", frequency: "PRN", duration: "as needed", notes: "For pain" },
    ],
    rawText: "This is raw text from OCR.",
  };
};

// @desc    Upload prescription image and get parsed data (OCR)
// @route   POST /api/prescriptions/upload
// @access  Private (Patient/Doctor)
exports.uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Save the image path (e.g., to S3 or local disk for processing)
    // For now, we'll just use a dummy path
    const imageUrl = `/uploads/${req.file.filename}`;

    // Simulate OCR processing
    const parsedData = await processImageWithOCR(imageUrl);

    // In a real scenario, you might save the prescription with a temporary status
    // and return a job ID if OCR is asynchronous.

    res.status(200).json({
      message: 'Image uploaded and processed',
      imageUrl,
      parsedData,
      jobId: 'dummy_job_id', // Placeholder
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Private (Patient/Doctor/Family with consent)
exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate('doctorId patientId', 'name email');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Authorization check
    const isAuthorized = 
      prescription.patientId._id.toString() === req.user.id ||
      prescription.doctorId._id.toString() === req.user.id ||
      (req.user.role === 'family' && req.user.linkedPatients.includes(prescription.patientId._id.toString()));

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to view this prescription' });
    }

    res.json(prescription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create/Save a validated prescription (after OCR and user review)
// @route   POST /api/prescriptions
// @access  Private (Doctor/Patient - if allowed to self-upload and validate)
exports.createPrescription = async (req, res) => {
  try {
    const { patientId, doctorId, parsedData, validated } = req.body;

    // Basic validation and authorization
    if (!patientId || !parsedData) {
      return res.status(400).json({ message: 'Patient ID and parsed data are required' });
    }

    // Ensure doctorId is provided if the user is a doctor, or if it's a patient self-upload, ensure patientId matches req.user.id
    if (req.user.role === 'doctor' && req.user.id !== doctorId) {
      return res.status(403).json({ message: 'Doctors can only create prescriptions for themselves' });
    }
    if (req.user.role === 'patient' && req.user.id !== patientId) {
      return res.status(403).json({ message: 'Patients can only create prescriptions for themselves' });
    }

    const newPrescription = new Prescription({
      doctorId: doctorId || req.user.id, // Doctor creates for patient, or patient uploads for self
      patientId,
      parsedData,
      validatedBy: req.user.id, // User who validated/created it
      validated: validated || true, // Assume true if created via this endpoint after review
      // imageUrl: ... // If this came from an upload, you might link the imageUrl here
    });

    const prescription = await newPrescription.save();
    res.status(201).json(prescription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
