const express = require('express');
const router = express.Router();

const { handlePaymentMercadoPago, handleSendConfirmationPurchase } = require('../controllers/payment.controller');


router.post('/payments', handlePaymentMercadoPago);

router.post('/webhookmp', handleSendConfirmationPurchase)

module.exports = router