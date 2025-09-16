const express = require('express');
const routes = express.Router();

const { handlePaymentMercadoPago } = require('../controllers/payment.controller');


routes.post('/payments', handlePaymentMercadoPago);

module.exports = routes