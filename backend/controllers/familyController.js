const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Send a family invite to link patient
// @route   POST /api/family/invite
// @access  Private (Patient)
exports.sendFamilyInvite = async (req, res) => {
  try {
    const { patientId, email } = req.body;

    // Ensure authenticated user is the patient sending the invite
    if (req.user.id !== patientId || req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Not authorized to send invites for this patient' });
    }

    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Create a temporary token for the family member to accept the invite
    const inviteToken = jwt.sign(
      { patientId: patient._id, email },
      process.env.JWT_SECRET, // Using JWT_SECRET for invite token as well
      { expiresIn: '1d' }
    );

    // In a real application, you would email this inviteToken to the 'email' address.
    // For now, we'll just return it.
    res.status(200).json({
      message: 'Family invite sent (token generated)',
      inviteToken,
      // In a real app, send email with a link like: `${FRONTEND_URL}/accept-invite?token=${inviteToken}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Accept a family invite
// @route   POST /api/family/accept-invite (conceptual, would be handled on frontend with token)
// @access  Public (but token required)
exports.acceptFamilyInvite = async (req, res) => {
  try {
    const { inviteToken } = req.body;

    if (!inviteToken) {
      return res.status(400).json({ message: 'No invite token provided' });
    }

    const decoded = jwt.verify(inviteToken, process.env.JWT_SECRET);
    const { patientId, email } = decoded;

    // Find the family member who is accepting (current authenticated user)
    const familyMember = await User.findById(req.user.id);
    if (!familyMember || familyMember.email !== email || familyMember.role !== 'family') {
      return res.status(403).json({ message: 'Invalid invite or not a family member' });
    }

    // Link the patient to the family member
    if (!familyMember.linkedPatients.includes(patientId)) {
      familyMember.linkedPatients.push(patientId);
      await familyMember.save();
    }

    res.status(200).json({ message: 'Family invite accepted, patient linked successfully' });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid or expired invite token' });
  }
};
