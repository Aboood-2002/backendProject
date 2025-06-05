// server/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createCheckoutSession, handleWebhook, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware.js');

router.post('/checkout', protect, createCheckoutSession);
router.post('/webhook', handleWebhook);
router.get('/verify', protect, verifyPayment);

module.exports = router;