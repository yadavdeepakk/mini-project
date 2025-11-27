const express = require('express');
const { sendFamilyInvite, acceptFamilyInvite } = require('../controllers/familyController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/invite', protect, authorize('patient'), sendFamilyInvite);
router.post('/accept-invite', protect, authorize('family'), acceptFamilyInvite); // This route would be called by the family member

module.exports = router;
