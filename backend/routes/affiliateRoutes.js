const express = require('express');
const { openTata1mgAffiliateLink } = require('../controllers/affiliateController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/tata1mg/open', protect, authorize('patient'), openTata1mgAffiliateLink);

module.exports = router;
