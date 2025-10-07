const express = require('express');
const routes = express.Router();

const { handlePaymentMercadoPago, handleSendConfirmationPurchase } = require('../controllers/payment.controller');


routes.post('/payments', handlePaymentMercadoPago);

routes.post('/webhookmp', handleSendConfirmationPurchase)

module.exports = routes